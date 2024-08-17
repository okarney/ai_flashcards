import { NextResponse } from "next/server";
import Stripe from "stripe";
import { updateUserSubscriptionStatus } from "@/firebase"; // Firestore
import { getAuth } from "@clerk/nextjs/server"; // Clerk server-side authentication

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { priceId, userId } = await req.json();

        // Clerk authentication check
        const { userId: clerkUserId } = getAuth(req);

        if (!clerkUserId || clerkUserId !== userId) {
            return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
        }

        if (!priceId || !userId) {
            return NextResponse.json({ error: 'Price ID and User ID are required' }, { status: 400 });
        }

        const price = await stripe.prices.retrieve(priceId);

        const checkoutSession = await stripe.checkout.sessions.create({
            mode: price.type === 'recurring' ? 'subscription' : 'payment',
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}&user_id=${userId}`, // Pass userId in success URL
            cancel_url: `${req.headers.get('origin')}/`,
            metadata: { user_id: userId }
        });

        return NextResponse.json({ id: checkoutSession.id }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create checkout session', details: error.message }, { status: 500 });
    }
}

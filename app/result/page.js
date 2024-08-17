'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs'; // Clerk authentication
import { updateUserSubscriptionStatus } from "@/firebase"; // Firestore function to update the user's subscription status
import getStripe from "@/utils/get-stripe";

export default function Result() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('session_id');
    const userIdFromUrl = searchParams.get('user_id'); // Retrieve userId from URL query params
    const { user } = useUser(); // Clerk user data

    useEffect(() => {
        if (sessionId && (user || userIdFromUrl)) {
            confirmSubscription(sessionId, user?.id || userIdFromUrl); // Use Clerk user.id if available, fallback to userId from URL
        }
    }, [sessionId, user]);

    const confirmSubscription = async (sessionId, userId) => {
        try {
            const stripe = await getStripe();

            // Retrieve session from Stripe
            const session = await stripe.checkout.sessions.retrieve(sessionId);

            // If payment is successful, update the user's subscription status in Firestore
            if (session.payment_status === 'paid') {
                await updateUserSubscriptionStatus(userId, 'active');
                router.push('/flashcards'); // Redirect to flashcards page
            } else {
                router.push('/'); // Redirect to home if payment failed
            }
        } catch (error) {
            console.error('Failed to confirm subscription:', error);
            router.push('/'); // Redirect to home on error
        }
    };

    return (
        <div>
            <h1>Processing Subscription...</h1>
        </div>
    );
}

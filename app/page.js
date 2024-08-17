'use client'

import { useState } from 'react';
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, useUser, UserButton } from "@clerk/nextjs";
import { Container, Box, Toolbar, AppBar, Grid, Typography, Button, Snackbar } from "@mui/material";
import Head from 'next/head';

export default function Home() {
  const [error, setError] = useState(null);
  const { user } = useUser(); // Access the authenticated user from Clerk

  const handleCheckout = async (priceId, planName) => {
    // Check if the user is authenticated
    if (!user) {
      setError('You need to be logged in to select a plan.');
      return;
    }

    if (!priceId || !user?.id) {
      setError('Price ID and User ID are required');
      return;
    }

    try {
      const response = await fetch('/api/checkout_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, userId: user.id }), // Include userId in the request body
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError(`Failed to create checkout session: ${errorText}`);
        return;
      }

      const checkoutSession = await response.json();

      if (!checkoutSession.id) {
        setError('Invalid checkout session response');
        return;
      }

      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSession.id,
      });

      if (error) {
        setError(`Error redirecting to checkout: ${error.message}`);
      }
    } catch (err) {
      setError(`Unexpected error: ${err.message}`);
    }
  };


  const handleCloseError = () => {
    setError(null);
  };

  const pricingPlans = [
    { name: 'Basic', price: '$5', description: 'Access to basic flashcard features and limited storage.', priceId: 'price_basic_id' },
    { name: 'Plus', price: '$10', description: 'Access to basic flashcards with unlimited storage.', priceId: 'price_plus_id' },
    { name: 'Pro', price: '$15', description: 'Unlimited flashcards and storage.', priceId: 'price_1PomF7GbCAydF8VzyvZSh5Eg' },
  ];

  return (
      <Container maxWidth="100vw">
        <Head>
          <title>AI Flashcards</title>
          <meta name="description" content="Create flashcards from your text" />
        </Head>

        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              AI Flashcards
            </Typography>
            <SignedOut>
              <Button color="inherit" href="/sign-in">
                Login
              </Button>
              <Button color="inherit" href="/sign-up">
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>

        <Box sx={{ textAlign: "center", marginY: 4 }}>
          <Typography variant="h2" gutterBottom>Welcome to AI Flashcards!</Typography>
          <Typography variant="h5" gutterBottom>The easiest way to make flashcards from text!</Typography>
          <SignedIn>
            <Box sx={{ marginTop: 2 }}>
              <Button variant="contained" color="primary" href="/generate" sx={{ marginRight: 2 }}>
                Generate
              </Button>
              <Button variant="contained" color="primary" href="/flashcards">
                Flashcards
              </Button>
            </Box>
          </SignedIn>
        </Box>

        <Box sx={{ my: 6 }}>
          <Typography variant="h4" gutterBottom>Features</Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Easy Text Input</Typography>
              <Typography variant="body1">Creating flashcards has never been easier!</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>AI-Powered Generation</Typography>
              <Typography variant="body1">Our AI helps create effective flashcards from your text.</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Study Anywhere</Typography>
              <Typography variant="body1">Access your flashcards on any device, anytime.</Typography>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ my: 6, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>Pricing</Typography>
          <Grid container spacing={4}>
            {pricingPlans.map((plan) => (
                <Grid item xs={12} md={4} key={plan.name}>
                  <Box sx={{ p: 3, border: "1px solid", borderColor: "grey.300", borderRadius: 2 }}>
                    <Typography variant="h5" gutterBottom>{plan.name}</Typography>
                    <Typography variant="h6" gutterBottom>{plan.price} / month</Typography>
                    <Typography gutterBottom>{plan.description}</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => handleCheckout(plan.priceId, plan.name)}
                    >
                      Choose {plan.name} Plan
                    </Button>
                  </Box>
                </Grid>
            ))}
          </Grid>
        </Box>

        <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={handleCloseError}
            message={error}
        />
      </Container>
  );
}

'use client'
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Container, Box, Toolbar, AppBar, Grid, Typography, Button } from "@mui/material";
import Head from 'next/head';

export default function Home() {
  return (
    <Container maxWidth="100vw">
      <Head>
        <title>AI Flashcards</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant = "h6" style={{flexGrow:1}}>
            AI Flashcards
          </Typography>
          <SignedOut>
            <Button color="inherit" href="sign-in">
              {''}
              Login
            </Button>
            <Button color="inherit" href="sign-up">
              {''}
              Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box sx={{textAlign: "center", marginY: 4}}>
        <Typography variant="h2" gutterBottom>Welcome to AI Flashcards!</Typography>
        <Typography variant="h5" gutterBottom>The easiest way to make flashcards from text!</Typography>
        <Button variant="contained" color="primary" sx={{marginTop: 2}}>
          Get Started
        </Button>
      </Box>
      <Box sx={{my:6}}>
        <Typography variant="h4" gutterBottom>Features</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Easy Text Input</Typography>
            <Typography variant="h7">Creating flashcards has never been easier!</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Easy Text Input</Typography>
            <Typography variant="h7">Creating flashcards has never been easier!</Typography>
          </Grid><Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Easy Text Input</Typography>
            <Typography variant="h7">Creating flashcards has never been easier!</Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{my: 6, textAlign: "center"}}>
        <Typography variant="h4" gutterBottom>Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{p:3, border: "1px solid", borderColor: "grey.300", borderRadius: 2}}>
              <Typography variant="h5" gutterBottom>Basic</Typography>
              <Typography variant="h6" gutterBottom>$5 / month</Typography>
              <Typography gutterBottom>Access to basic flashcard features and limited storage.</Typography>
              <Button variant="contained" color="primary" sx={{mt:2}}>Choose Basic Plan</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{p:3, border: "1px solid", borderColor: "grey.300", borderRadius: 2}}>
              <Typography variant="h5" gutterBottom>Plus</Typography>
              <Typography variant="h6" gutterBottom>$10 / month</Typography>
              <Typography gutterBottom>Access to basic flashcards with unlimited storage.</Typography>
              <Button variant="contained" color="primary" sx={{mt:2}}>Choose Plus Plan</Button>
            </Box>
          </Grid><Grid item xs={12} md={4}>
            <Box sx={{p:3, border: "1px solid", borderColor: "grey.300", borderRadius: 2}}>
              <Typography variant="h5" gutterBottom>Pro</Typography>
              <Typography variant="h6" gutterBottom>$15 / month</Typography>
              <Typography gutterBottom>Unlimited flashcards and storage.</Typography>
              <Button variant="contained" color="primary" sx={{mt:2}}>Choose Pro Plan</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

    </Container>
  )
}

import React from 'react'
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material'
import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignUpPage() {
    return <Container maxWidth='100vw'>
        <AppBar position="static" sx={{backgroundColor: '#000000'}}>
            <Toolbar>
                <Typography variant="h6" sx={{flexGrow: 1}}>
                    AI Flashcards
                </Typography>
                <Button color="inherit">
                    <Link href="/sign-in" passHref>
                        Login
                    </Link>
                </Button>
                <Button color="inherit">
                    <Link href="/sign-up" passHref>
                        Sign Up
                    </Link>
                </Button>
            </Toolbar>
        </AppBar>

        <Box
            display = "flex"
            flexDirection = "column"
            alignItems = "center"
            justifyContent="center"
        >
            <Typography variant="h4">Sign Up</Typography>
            <SignIn/>
        </Box>

    </Container>

}


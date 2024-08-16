'use client'

import { useState } from 'react'
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    CircularProgress,
} from '@mui/material'

export default function Generate() {
    const [text, setText] = useState('')
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (!text.trim()) {
            alert('Please enter some text to generate flashcards.')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                body: JSON.stringify({ text }), // Send text in JSON format
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('Failed to generate flashcards')
            }

            const data = await response.json()
            console.log("API response:", data)
            setFlashcards(data.flashcards || [])
        } catch (error) {
            console.error('Error generating flashcards:', error)
            alert('An error occurred while generating flashcards. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleCardClick = (index) => {
        setFlipped(prev => ({
            ...prev,
            [index]: !prev[index]
        }))
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Generate Flashcards
                </Typography>
                <TextField
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    label="Enter text"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    fullWidth
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Generate Flashcards'}
                </Button>
            </Box>

            {loading && <CircularProgress />}

            {!loading && flashcards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Generated Flashcards
                    </Typography>
                    <Grid container spacing={2}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card
                                    onClick={() => handleCardClick(index)}
                                    sx={{
                                        height: 200,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        perspective: '1000px'
                                    }}
                                >
                                    <CardContent sx={{
                                        width: '100%',
                                        height: '100%',
                                        transition: 'transform 0.6s',
                                        transformStyle: 'preserve-3d',
                                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                    }}>
                                        <Box sx={{
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            backfaceVisibility: 'hidden',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <Typography>{flashcard.front}</Typography>
                                        </Box>
                                        <Box sx={{
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            backfaceVisibility: 'hidden',
                                            transform: 'rotateY(180deg)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <Typography>{flashcard.back}</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {!loading && flashcards.length === 0 && (
                <Typography sx={{ mt: 4 }}>No flashcards generated yet.</Typography>
            )}
        </Container>
    )
}

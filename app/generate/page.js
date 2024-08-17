'use client'

import { useState } from 'react';
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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { doc, collection, writeBatch, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique IDs

export default function Generate() {
    const { user } = useUser();
    const router = useRouter(); // Initialize useRouter
    const [text, setText] = useState('');
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const [loading, setLoading] = useState(false);
    const [setName, setSetName] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleSubmit = async () => {
        if (!text.trim()) {
            alert('Please enter some text to generate flashcards.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                body: JSON.stringify({ text }), // Send text in JSON format
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to generate flashcards');
            }

            const data = await response.json();
            console.log("API response:", data);
            setFlashcards(data.flashcardSets[0]?.flashcards || []);
        } catch (error) {
            console.error('Error generating flashcards:', error);
            alert('An error occurred while generating flashcards. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (id) => {
        router.push(`/flashcards?id=${id}`); // Navigate to the detailed view of the flashcard set
    };

    const handleOpenDialog = () => setDialogOpen(true);
    const handleCloseDialog = () => setDialogOpen(false);

    const saveFlashcards = async () => {
        if (!setName.trim()) {
            alert('Please enter a name for your flashcard set.');
            return;
        }

        try {
            const userDocRef = doc(collection(db, 'users'), user.id);
            const userDocSnap = await getDoc(userDocRef);

            const batch = writeBatch(db);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const updatedSets = [...(userData.flashcardSets || []), { name: setName, id: uuidv4(), flashcards }];
                batch.update(userDocRef, { flashcardSets: updatedSets });
            } else {
                batch.set(userDocRef, { flashcardSets: [{ name: setName, id: uuidv4(), flashcards }] });
            }

            await batch.commit();

            alert('Flashcards saved successfully!');
            handleCloseDialog();
            setSetName('');
        } catch (error) {
            console.error('Error saving flashcards:', error);
            alert('An error occurred while saving flashcards. Please try again.');
        }
    };

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
                                    onClick={() => handleCardClick(flashcard.id)} // Add click handler to navigate
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

            {flashcards.length > 0 && (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                        Save Flashcards
                    </Button>
                </Box>
            )}

            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Save Flashcard Set</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for your flashcard set.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Set Name"
                        type="text"
                        fullWidth
                        value={setName}
                        onChange={(e) => setSetName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={saveFlashcards} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

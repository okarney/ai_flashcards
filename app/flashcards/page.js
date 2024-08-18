'use client';

import { Card, CardActionArea, CardContent, Container, Grid, Typography, Box } from "@mui/material";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [selectedSet, setSelectedSet] = useState(null);
    const [flippedCards, setFlippedCards] = useState({});

    useEffect(() => {
        if (!isLoaded) return;
        if (!isSignedIn) {
            router.push("/sign-in");
        } else {
            fetchFlashcardSets();
        }
    }, [isLoaded, isSignedIn]);

    const fetchFlashcardSets = async () => {
        if (!user) return;

        const userDocRef = doc(db, 'users', user.id);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setFlashcardSets(userData.flashcardSets || []);
        } else {
            setFlashcardSets([]);
        }
    };

    const handleCardClick = (flashcardId) => {
        setFlippedCards((prev) => ({ ...prev, [flashcardId]: !prev[flashcardId] }));
    };

    const handleSetClick = (set) => {
        setSelectedSet(selectedSet?.id === set.id ? null : set);
        setFlippedCards({});
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>Your Flashcard Sets</Typography>
            <Grid container spacing={2}>
                {flashcardSets.length > 0 ? flashcardSets.map((set) => (
                    <Grid item xs={12} sm={6} md={4} key={set.id}>
                        <Card>
                            <CardActionArea onClick={() => handleSetClick(set)}>
                                <CardContent>
                                    <Typography variant="h5">{set.name}</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                )) : (
                    <Typography>No flashcard sets available.</Typography>
                )}
            </Grid>

            {selectedSet && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>Flashcards for {selectedSet.name}</Typography>
                    <Grid container spacing={2}>
                        {selectedSet.flashcards?.length > 0 ? selectedSet.flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card onClick={() => handleCardClick(index)}>
                                    <CardContent>
                                        <Typography variant="h6">
                                            {flippedCards[index] ? flashcard.back : flashcard.front}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )) : (
                            <Typography>No flashcards available for this set.</Typography>
                        )}
                    </Grid>
                </Box>
            )}
        </Container>
    );
}

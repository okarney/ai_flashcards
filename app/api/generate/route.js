import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

const systemPrompt = `
You are a flashcard creator. You take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return the flashcards in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;

export async function POST(req) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try {
        const { text } = await req.json();

        if (!text || typeof text !== 'string') {
            return NextResponse.json({ error: 'Invalid input text' }, { status: 400 });
        }

        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: text },
            ],
            model: 'gpt-4',
        });

        const responseText = completion.choices[0].message.content;
        let flashcards;

        try {
            flashcards = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Error parsing flashcards:', parseError);
            return NextResponse.json({ error: 'Invalid response format from OpenAI' }, { status: 500 });
        }

        if (!flashcards.flashcards || !Array.isArray(flashcards.flashcards) || flashcards.flashcards.length !== 10) {
            console.error('Invalid flashcards data:', flashcards);
            return NextResponse.json({ error: 'Generated flashcards are not in the expected format' }, { status: 500 });
        }

        const flashcardSet = {
            name: 'Generated Flashcard Set',
            id: uuidv4(),
            flashcards: flashcards.flashcards
        };

        return NextResponse.json({ flashcardSets: [flashcardSet] });
    } catch (error) {
        console.error('Error generating flashcards:', error);
        return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Define the system prompt for the flashcard generation
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
`

export async function POST(req) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })

    try {
        const { text } = await req.json()  // Use .json() to parse the request body

        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: text },
            ],
            model: 'gpt-4',
        })

        const responseText = completion.choices[0].message.content
        const flashcards = JSON.parse(responseText)

        return NextResponse.json(flashcards)
    } catch (error) {
        console.error('Error generating flashcards:', error)
        return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 })
    }
}

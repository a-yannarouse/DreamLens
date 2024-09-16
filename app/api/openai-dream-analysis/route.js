import { firestore } from '../../../firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getAuth } from '@clerk/nextjs/server'; // Import Clerk's server-side auth

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure your API key is set properly
});

export async function POST(req) {
  try {
    // Verify the token and get userId
    const { userId } = await getAuth(req); // Get userId from Clerk

    // Parse the request body
    const { dreamDescription, mood, intensity, analyzeDream } = await req.json();
    console.log('Request Body:', { dreamDescription, mood, intensity, analyzeDream });

    // Validate required fields
    if (!dreamDescription || !mood || !intensity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save the dream entry in Firebase Firestore with userId
    await addDoc(collection(firestore, 'dreams'), {
      userId, // Include userId in the document
      dreamDescription,
      mood,
      intensity,
      timestamp: new Date(),
    });

    // AI-Powered Dream Analysis
    let dreamAnalysis = null;
    if (analyzeDream) {
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an expert dream analyst." },
          { role: "user", content: `Analyze the following dream: ${dreamDescription}` }
        ],
        max_tokens: 300, // Adjust token length based on the complexity of the response
      });
      dreamAnalysis = aiResponse.choices[0].message.content.trim();
    }

    // Return response with dream analysis
    return NextResponse.json({
      message: 'Dream saved successfully!',
      dreamAnalysis: analyzeDream ? dreamAnalysis : null,
    }, { status: 200 });
  } catch (error) {
    console.error('Error saving dream:', error); // Log the error for debugging
    return NextResponse.json({ error: 'Error saving dream', details: error.message }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ message: 'Only POST method is allowed.' }, { status: 405 });
}

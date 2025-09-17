import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ollamaUrl = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
    
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error calling Ollama API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to connect to Ollama API. Make sure Ollama is running on http://127.0.0.1:11434' 
      },
      { status: 500 }
    );
  }
}

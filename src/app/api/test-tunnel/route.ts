import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const tunnelUrl = process.env.OLLAMA_TUNNEL_URL;
    
    console.log('🔍 Test tunnel Vercel...');
    console.log('🌐 OLLAMA_TUNNEL_URL:', tunnelUrl);
    
    if (!tunnelUrl) {
      return NextResponse.json({
        error: 'OLLAMA_TUNNEL_URL not defined',
        status: 'error'
      });
    }
    
    // Test de connexion au tunnel
    const testResponse = await fetch(`${tunnelUrl}/api/tags`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!testResponse.ok) {
      return NextResponse.json({
        error: `Tunnel not accessible: ${testResponse.status} ${testResponse.statusText}`,
        tunnelUrl,
        status: 'error'
      });
    }
    
    const data = await testResponse.json();
    
    return NextResponse.json({
      message: 'Tunnel accessible',
      tunnelUrl,
      modelsCount: data.models?.length || 0,
      status: 'success'
    });
    
  } catch (error) {
    console.error('Erreur test tunnel:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    });
  }
}

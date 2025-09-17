// Script pour tester la connexion tunnel depuis Vercel
const https = require('https');

async function testTunnel() {
    const tunnelUrl = process.env.OLLAMA_TUNNEL_URL || 'https://7ed3816a8047.ngrok-free.app';
    
    console.log('🔍 Test de connexion tunnel...');
    console.log('🌐 URL:', tunnelUrl);
    
    try {
        // Test 1: Vérifier les modèles
        console.log('\n1. Test /api/tags...');
        const tagsResponse = await fetch(`${tunnelUrl}/api/tags`);
        console.log('Status:', tagsResponse.status);
        
        if (tagsResponse.ok) {
            const tagsData = await tagsResponse.json();
            console.log('✅ Modèles disponibles:', tagsData.models.length);
        } else {
            console.log('❌ Erreur tags:', await tagsResponse.text());
        }
        
        // Test 2: Test de génération
        console.log('\n2. Test /api/generate...');
        const generateResponse = await fetch(`${tunnelUrl}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'GandalfBaum/deepseek_r1-claude3.7:latest',
                prompt: 'Test de connexion depuis Vercel',
                stream: false
            })
        });
        
        console.log('Status:', generateResponse.status);
        
        if (generateResponse.ok) {
            const generateData = await generateResponse.json();
            console.log('✅ Réponse reçue:', generateData.response.substring(0, 100) + '...');
        } else {
            console.log('❌ Erreur generate:', await generateResponse.text());
        }
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}

testTunnel();

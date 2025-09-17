#!/bin/bash
# Script bash pour démarrer Ollama avec tunnel
# Exécuter: chmod +x start-ollama-tunnel.sh && ./start-ollama-tunnel.sh

echo "🚀 Démarrage d'Ollama avec tunnel..."

# Configuration Ollama pour accepter les connexions externes
export OLLAMA_HOST="0.0.0.0:11434"
echo "✅ Configuration Ollama: $OLLAMA_HOST"

# Démarrer Ollama en arrière-plan
echo "🔄 Démarrage d'Ollama..."
ollama serve &
OLLAMA_PID=$!

# Attendre que Ollama soit prêt
echo "⏳ Attente du démarrage d'Ollama..."
sleep 10

# Vérifier que Ollama fonctionne
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "✅ Ollama est prêt !"
    MODEL_COUNT=$(curl -s http://localhost:11434/api/tags | jq '.models | length' 2>/dev/null || echo "?")
    echo "📋 Modèles disponibles: $MODEL_COUNT"
else
    echo "❌ Erreur: Ollama n'est pas accessible"
    echo "💡 Vérifiez que Ollama est installé et configuré"
    kill $OLLAMA_PID 2>/dev/null
    exit 1
fi

# Fonction de nettoyage
cleanup() {
    echo "🛑 Arrêt des services..."
    kill $OLLAMA_PID 2>/dev/null
    pkill -f ngrok 2>/dev/null
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT SIGTERM

# Démarrer ngrok
echo "🌐 Démarrage du tunnel ngrok..."
echo "📝 Note: Gardez ce terminal ouvert pour maintenir le tunnel"
echo "🔗 L'URL du tunnel sera affichée ci-dessous"

# Démarrer ngrok en arrière-plan
ngrok http 11434 --host-header=localhost:11434 &
NGROK_PID=$!

echo "✅ Tunnel démarré !"
echo "📋 Prochaines étapes:"
echo "   1. Copiez l'URL ngrok (ex: https://abc123.ngrok.io)"
echo "   2. Ajoutez-la comme variable OLLAMA_TUNNEL_URL sur Vercel"
echo "   3. Redéployez votre application Vercel"
echo "   4. Testez l'IA sur votre site Vercel"

echo ""
echo "🛑 Pour arrêter: Ctrl+C"
echo ""

# Attendre indéfiniment
while true; do
    sleep 1
done

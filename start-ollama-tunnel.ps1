# Script PowerShell pour démarrer Ollama avec tunnel
# Exécuter en tant qu'administrateur

Write-Host "🚀 Démarrage d'Ollama avec tunnel..." -ForegroundColor Green

# Configuration Ollama pour accepter les connexions externes
$env:OLLAMA_HOST = "0.0.0.0:11434"
Write-Host "✅ Configuration Ollama: $env:OLLAMA_HOST" -ForegroundColor Yellow

# Démarrer Ollama en arrière-plan
Write-Host "🔄 Démarrage d'Ollama..." -ForegroundColor Blue
Start-Process -FilePath "ollama" -ArgumentList "serve" -WindowStyle Hidden

# Attendre que Ollama soit prêt
Write-Host "⏳ Attente du démarrage d'Ollama..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Vérifier que Ollama fonctionne
try {
    $response = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method GET
    Write-Host "✅ Ollama est prêt !" -ForegroundColor Green
    Write-Host "📋 Modèles disponibles: $($response.models.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Erreur: Ollama n'est pas accessible" -ForegroundColor Red
    Write-Host "💡 Vérifiez que Ollama est installé et configuré" -ForegroundColor Yellow
    exit 1
}

# Démarrer ngrok
Write-Host "🌐 Démarrage du tunnel ngrok..." -ForegroundColor Blue
Write-Host "📝 Note: Gardez cette fenêtre ouverte pour maintenir le tunnel" -ForegroundColor Yellow
Write-Host "🔗 L'URL du tunnel sera affichée ci-dessous" -ForegroundColor Cyan

# Démarrer ngrok
Start-Process -FilePath "ngrok" -ArgumentList "http", "11434", "--host-header=localhost:11434"

Write-Host "✅ Tunnel démarré !" -ForegroundColor Green
Write-Host "📋 Prochaines étapes:" -ForegroundColor Yellow
Write-Host "   1. Copiez l'URL ngrok (ex: https://abc123.ngrok.io)" -ForegroundColor White
Write-Host "   2. Ajoutez-la comme variable OLLAMA_TUNNEL_URL sur Vercel" -ForegroundColor White
Write-Host "   3. Redéployez votre application Vercel" -ForegroundColor White
Write-Host "   4. Testez l'IA sur votre site Vercel" -ForegroundColor White

Write-Host "`n🛑 Pour arrêter: Fermez cette fenêtre ou Ctrl+C" -ForegroundColor Red
Write-Host "`nAppuyez sur une touche pour continuer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

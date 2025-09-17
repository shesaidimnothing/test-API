# Script pour lancer ngrok correctement
Write-Host "🚀 Lancement de ngrok avec la bonne configuration" -ForegroundColor Green

# Arrêter ngrok existant
Write-Host "1. Arrêt de ngrok existant..." -ForegroundColor Yellow
Get-Process -Name "ngrok" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Vérifier qu'Ollama fonctionne
Write-Host "2. Vérification d'Ollama..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method GET
    Write-Host "✅ Ollama fonctionne sur le port 11434" -ForegroundColor Green
} catch {
    Write-Host "❌ Ollama ne fonctionne pas sur le port 11434" -ForegroundColor Red
    Write-Host "💡 Lancez d'abord: ollama serve" -ForegroundColor Yellow
    exit 1
}

# Configurer Ollama pour accepter les connexions externes
Write-Host "3. Configuration d'Ollama..." -ForegroundColor Yellow
$env:OLLAMA_HOST = "0.0.0.0:11434"
Write-Host "✅ OLLAMA_HOST configuré: $env:OLLAMA_HOST" -ForegroundColor Green

# Lancer ngrok avec la bonne configuration
Write-Host "4. Lancement de ngrok sur le port 11434..." -ForegroundColor Yellow
Write-Host "🌐 ngrok http 11434 --host-header=localhost:11434" -ForegroundColor Gray

# Lancer ngrok en arrière-plan
Start-Process -FilePath "ngrok" -ArgumentList "http", "11434", "--host-header=localhost:11434" -WindowStyle Hidden

# Attendre que ngrok démarre
Write-Host "⏳ Attente du démarrage de ngrok..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Récupérer l'URL du tunnel
Write-Host "5. Récupération de l'URL du tunnel..." -ForegroundColor Yellow
try {
    $tunnelInfo = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -Method GET
    if ($tunnelInfo.tunnels.Count -gt 0) {
        $tunnel = $tunnelInfo.tunnels[0]
        $tunnelUrl = $tunnel.public_url
        $config = $tunnel.config
        
        Write-Host "✅ URL du tunnel: $tunnelUrl" -ForegroundColor Green
        Write-Host "🔗 Configuration: $($config.addr)" -ForegroundColor Cyan
        
        # Vérifier que le port est correct
        if ($config.addr -eq "http://localhost:11434") {
            Write-Host "✅ Port correct (11434)" -ForegroundColor Green
        } else {
            Write-Host "❌ Port incorrect: $($config.addr)" -ForegroundColor Red
            Write-Host "💡 Relancez le script" -ForegroundColor Yellow
            exit 1
        }
        
        # Tester le tunnel
        Write-Host "6. Test du tunnel..." -ForegroundColor Yellow
        try {
            $testResponse = Invoke-RestMethod -Uri "$tunnelUrl/api/tags" -Method GET
            Write-Host "✅ Tunnel fonctionne !" -ForegroundColor Green
            Write-Host "📋 Modèles disponibles: $($testResponse.models.Count)" -ForegroundColor Cyan
            
            Write-Host "`n🎯 Configuration Vercel:" -ForegroundColor Green
            Write-Host "Variable: OLLAMA_TUNNEL_URL" -ForegroundColor White
            Write-Host "Valeur: $tunnelUrl" -ForegroundColor White
            Write-Host "`n💡 Copiez cette URL et ajoutez-la à vos variables Vercel" -ForegroundColor Yellow
            
        } catch {
            Write-Host "❌ Erreur lors du test du tunnel: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Aucun tunnel trouvé" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Impossible de récupérer les infos ngrok: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nAppuyez sur une touche pour continuer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

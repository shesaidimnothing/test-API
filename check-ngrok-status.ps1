# Script pour vérifier le statut de ngrok
Write-Host "🔍 Vérification du statut ngrok" -ForegroundColor Green

try {
    # Récupérer les infos du tunnel
    $tunnelInfo = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -Method GET
    
    if ($tunnelInfo.tunnels.Count -gt 0) {
        $tunnel = $tunnelInfo.tunnels[0]
        $tunnelUrl = $tunnel.public_url
        $config = $tunnel.config
        
        Write-Host "✅ Tunnel actif trouvé" -ForegroundColor Green
        Write-Host "🌐 URL: $tunnelUrl" -ForegroundColor Cyan
        Write-Host "🔗 Configuration: $($config.addr)" -ForegroundColor Yellow
        
        # Vérifier si le port est correct
        if ($config.addr -eq "http://localhost:11434") {
            Write-Host "✅ Port correct (11434)" -ForegroundColor Green
        } else {
            Write-Host "❌ Port incorrect: $($config.addr)" -ForegroundColor Red
            Write-Host "💡 Relancez: ngrok http 11434 --host-header=localhost:11434" -ForegroundColor Yellow
        }
        
        # Tester la connexion
        Write-Host "`n🧪 Test de connexion..." -ForegroundColor Yellow
        try {
            $testResponse = Invoke-RestMethod -Uri "$tunnelUrl/api/tags" -Method GET
            Write-Host "✅ Connexion réussie !" -ForegroundColor Green
            Write-Host "📋 Modèles disponibles: $($testResponse.models.Count)" -ForegroundColor Cyan
            
            Write-Host "`n🎯 Configuration Vercel:" -ForegroundColor Green
            Write-Host "Variable: OLLAMA_TUNNEL_URL" -ForegroundColor White
            Write-Host "Valeur: $tunnelUrl" -ForegroundColor White
            
        } catch {
            Write-Host "❌ Erreur de connexion: $($_.Exception.Message)" -ForegroundColor Red
        }
        
    } else {
        Write-Host "❌ Aucun tunnel actif" -ForegroundColor Red
        Write-Host "💡 Lancez: ngrok http 11434 --host-header=localhost:11434" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Impossible de récupérer les infos ngrok" -ForegroundColor Red
    Write-Host "💡 Vérifiez que ngrok est en cours d'exécution" -ForegroundColor Yellow
}

Write-Host "`nAppuyez sur une touche pour continuer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

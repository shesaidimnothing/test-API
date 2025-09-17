# Script de diagnostic pour le tunnel Ollama
# Exécuter en PowerShell

Write-Host "🔍 Diagnostic du tunnel Ollama" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# 1. Vérifier Ollama local
Write-Host "`n1. Vérification d'Ollama local..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method GET
    Write-Host "✅ Ollama local fonctionne" -ForegroundColor Green
    Write-Host "📋 Modèles disponibles: $($response.models.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Ollama local ne fonctionne pas" -ForegroundColor Red
    Write-Host "💡 Lancez: ollama serve" -ForegroundColor Yellow
    exit 1
}

# 2. Vérifier la configuration Ollama
Write-Host "`n2. Vérification de la configuration Ollama..." -ForegroundColor Yellow
$ollamaHost = $env:OLLAMA_HOST
if ($ollamaHost -eq "0.0.0.0:11434") {
    Write-Host "✅ Configuration Ollama correcte: $ollamaHost" -ForegroundColor Green
} else {
    Write-Host "⚠️ Configuration Ollama: $ollamaHost" -ForegroundColor Yellow
    Write-Host "💡 Pour accepter les connexions externes: `$env:OLLAMA_HOST='0.0.0.0:11434'" -ForegroundColor Cyan
}

# 3. Vérifier ngrok
Write-Host "`n3. Vérification de ngrok..." -ForegroundColor Yellow
try {
    $ngrokProcess = Get-Process -Name "ngrok" -ErrorAction SilentlyContinue
    if ($ngrokProcess) {
        Write-Host "✅ ngrok est en cours d'exécution" -ForegroundColor Green
        
        # Essayer de récupérer l'URL ngrok
        try {
            $ngrokInfo = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -Method GET
            if ($ngrokInfo.tunnels.Count -gt 0) {
                $tunnelUrl = $ngrokInfo.tunnels[0].public_url
                Write-Host "🌐 URL du tunnel: $tunnelUrl" -ForegroundColor Cyan
                
                # Tester le tunnel
                Write-Host "`n4. Test du tunnel..." -ForegroundColor Yellow
                try {
                    $tunnelResponse = Invoke-RestMethod -Uri "$tunnelUrl/api/tags" -Method GET
                    Write-Host "✅ Tunnel fonctionne !" -ForegroundColor Green
                    Write-Host "📋 Modèles via tunnel: $($tunnelResponse.models.Count)" -ForegroundColor Cyan
                    
                    Write-Host "`n🎯 Configuration Vercel:" -ForegroundColor Green
                    Write-Host "Variable: OLLAMA_TUNNEL_URL" -ForegroundColor White
                    Write-Host "Valeur: $tunnelUrl" -ForegroundColor White
                    
                } catch {
                    Write-Host "❌ Tunnel ne fonctionne pas" -ForegroundColor Red
                    Write-Host "💡 Vérifiez que ngrok pointe vers le bon port" -ForegroundColor Yellow
                }
            } else {
                Write-Host "❌ Aucun tunnel actif trouvé" -ForegroundColor Red
            }
        } catch {
            Write-Host "❌ Impossible de récupérer les infos ngrok" -ForegroundColor Red
            Write-Host "💡 Vérifiez que ngrok est configuré correctement" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ ngrok n'est pas en cours d'exécution" -ForegroundColor Red
        Write-Host "💡 Lancez: ngrok http 11434 --host-header=localhost:11434" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Erreur lors de la vérification de ngrok" -ForegroundColor Red
}

# 5. Instructions
Write-Host "`n📋 Instructions:" -ForegroundColor Green
Write-Host "1. Si ngrok n'est pas lancé:" -ForegroundColor White
Write-Host "   ngrok http 11434 --host-header=localhost:11434" -ForegroundColor Gray
Write-Host "2. Copiez l'URL ngrok affichée" -ForegroundColor White
Write-Host "3. Ajoutez-la comme variable OLLAMA_TUNNEL_URL sur Vercel" -ForegroundColor White
Write-Host "4. Redéployez votre application" -ForegroundColor White

Write-Host "`nAppuyez sur une touche pour continuer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

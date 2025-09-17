# Script pour mettre à jour automatiquement l'URL ngrok sur Vercel
param(
    [string]$VercelToken = "",
    [string]$ProjectId = ""
)

Write-Host "🔄 Mise à jour automatique de l'URL ngrok sur Vercel" -ForegroundColor Green

# Vérifier les paramètres
if (-not $VercelToken -or -not $ProjectId) {
    Write-Host "❌ Paramètres manquants" -ForegroundColor Red
    Write-Host "Usage: .\update-vercel-tunnel.ps1 -VercelToken 'your-token' -ProjectId 'your-project-id'" -ForegroundColor Yellow
    Write-Host "`nPour obtenir ces informations:" -ForegroundColor Cyan
    Write-Host "1. VercelToken: Settings → Tokens → Create Token" -ForegroundColor White
    Write-Host "2. ProjectId: Settings → General → Project ID" -ForegroundColor White
    exit 1
}

# Récupérer l'URL ngrok actuelle
Write-Host "1. Récupération de l'URL ngrok actuelle..." -ForegroundColor Yellow
try {
    $tunnelInfo = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -Method GET
    if ($tunnelInfo.tunnels.Count -gt 0) {
        $tunnelUrl = $tunnelInfo.tunnels[0].public_url
        Write-Host "✅ URL ngrok: $tunnelUrl" -ForegroundColor Green
    } else {
        Write-Host "❌ Aucun tunnel ngrok trouvé" -ForegroundColor Red
        Write-Host "💡 Lancez d'abord: ngrok http 11434 --host-header=localhost:11434" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Impossible de récupérer l'URL ngrok" -ForegroundColor Red
    Write-Host "💡 Vérifiez que ngrok est en cours d'exécution" -ForegroundColor Yellow
    exit 1
}

# Tester le tunnel
Write-Host "2. Test du tunnel..." -ForegroundColor Yellow
try {
    $testResponse = Invoke-RestMethod -Uri "$tunnelUrl/api/tags" -Method GET
    Write-Host "✅ Tunnel fonctionne !" -ForegroundColor Green
} catch {
    Write-Host "❌ Tunnel ne fonctionne pas" -ForegroundColor Red
    exit 1
}

# Mettre à jour Vercel
Write-Host "3. Mise à jour de Vercel..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $VercelToken"
        "Content-Type" = "application/json"
    }
    
    $body = @{
        "key" = "OLLAMA_TUNNEL_URL"
        "value" = $tunnelUrl
        "type" = "encrypted"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "https://api.vercel.com/v9/projects/$ProjectId/env" -Method POST -Headers $headers -Body $body
    Write-Host "✅ Variable mise à jour sur Vercel !" -ForegroundColor Green
    Write-Host "🌐 Nouvelle URL: $tunnelUrl" -ForegroundColor Cyan
    
    # Déclencher un redéploiement
    Write-Host "4. Déclenchement du redéploiement..." -ForegroundColor Yellow
    $deployResponse = Invoke-RestMethod -Uri "https://api.vercel.com/v13/deployments" -Method POST -Headers $headers -Body '{"name":"' + $ProjectId + '"}'
    Write-Host "✅ Redéploiement déclenché !" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Erreur lors de la mise à jour de Vercel: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Vérifiez votre token et Project ID" -ForegroundColor Yellow
}

Write-Host "`nAppuyez sur une touche pour continuer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

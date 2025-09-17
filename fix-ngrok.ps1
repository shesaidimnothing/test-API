# Script pour corriger ngrok
Write-Host "Redemarrage de ngrok..." -ForegroundColor Yellow

# Arreter ngrok
Get-Process -Name "ngrok" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Configurer Ollama
$env:OLLAMA_HOST = "0.0.0.0:11434"
Write-Host "OLLAMA_HOST configure: $env:OLLAMA_HOST" -ForegroundColor Green

# Lancer ngrok
Write-Host "Lancement de ngrok sur le port 11434..." -ForegroundColor Cyan
Start-Process -FilePath "ngrok" -ArgumentList "http", "11434", "--host-header=localhost:11434" -WindowStyle Hidden

# Attendre
Start-Sleep -Seconds 5

# Tester
try {
    $tunnelInfo = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -Method GET
    if ($tunnelInfo.tunnels.Count -gt 0) {
        $tunnelUrl = $tunnelInfo.tunnels[0].public_url
        Write-Host "URL du tunnel: $tunnelUrl" -ForegroundColor Green
        
        # Tester le tunnel
        $testResponse = Invoke-RestMethod -Uri "$tunnelUrl/api/tags" -Method GET
        Write-Host "Tunnel fonctionne! Modeles: $($testResponse.models.Count)" -ForegroundColor Green
        
        Write-Host "Configuration Vercel:" -ForegroundColor Yellow
        Write-Host "Variable: OLLAMA_TUNNEL_URL" -ForegroundColor White
        Write-Host "Valeur: $tunnelUrl" -ForegroundColor White
    }
} catch {
    Write-Host "Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

Read-Host "Appuyez sur Entree pour continuer"

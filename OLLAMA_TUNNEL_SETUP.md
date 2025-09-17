# Configuration Tunnel Ollama pour Vercel

## 🚀 **Solution : Tunnel vers votre PC**

Cette solution permet à Vercel d'appeler directement votre Ollama local via un tunnel.

## 🔧 **Option 1 : ngrok (Recommandée)**

### Installation
```bash
# Télécharger ngrok depuis https://ngrok.com
# Ou via npm
npm install -g ngrok
```

### Configuration
```bash
# 1. Créer un compte gratuit sur ngrok.com
# 2. Obtenir votre authtoken
ngrok config add-authtoken YOUR_AUTHTOKEN

# 3. Créer un tunnel vers Ollama
ngrok http 11434 --host-header=localhost:11434
```

### Obtenir l'URL du tunnel
Après avoir lancé ngrok, vous verrez :
```
Session Status                online
Account                       your-email@example.com
Version                       3.x.x
Region                        Europe (eu)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:11434
```

**Copiez l'URL `https://abc123.ngrok.io`**

### Configuration Vercel
1. **Variables d'environnement** sur Vercel :
   - Nom : `OLLAMA_TUNNEL_URL`
   - Valeur : `https://abc123.ngrok.io`

2. **Redéployer** l'application

## 🔧 **Option 2 : Cloudflare Tunnel (Gratuit)**

### Installation
```bash
# Télécharger cloudflared depuis https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
```

### Configuration
```bash
# 1. Se connecter à Cloudflare
cloudflared tunnel login

# 2. Créer un tunnel
cloudflared tunnel create ollama-tunnel

# 3. Configurer le tunnel
cloudflared tunnel route dns ollama-tunnel ollama.yourdomain.com

# 4. Démarrer le tunnel
cloudflared tunnel run ollama-tunnel
```

## 🔧 **Option 3 : localtunnel (Simple)**

### Installation
```bash
npm install -g localtunnel
```

### Configuration
```bash
# Créer un tunnel
lt --port 11434 --subdomain your-ollama-tunnel
```

**URL générée :** `https://your-ollama-tunnel.loca.lt`

## 🔧 **Option 4 : Serveo (Sans installation)**

### Configuration
```bash
# Créer un tunnel SSH
ssh -R 80:localhost:11434 serveo.net
```

**URL générée :** `https://serveo.net` (ou URL personnalisée)

## ⚙️ **Configuration Ollama pour le Tunnel**

### Modifier la configuration Ollama
```bash
# Arrêter Ollama
# Modifier la configuration pour accepter les connexions externes

# Windows (PowerShell en admin)
$env:OLLAMA_HOST="0.0.0.0:11434"
ollama serve

# Linux/Mac
export OLLAMA_HOST="0.0.0.0:11434"
ollama serve
```

### Vérifier la configuration
```bash
# Tester l'API via le tunnel
curl https://your-tunnel-url.ngrok.io/api/tags
```

## 🎯 **Configuration Vercel**

### Variables d'environnement
```
OLLAMA_TUNNEL_URL=https://your-tunnel-url.ngrok.io
```

### Ordre de priorité
1. **Tunnel Ollama** (votre PC)
2. **API Externe** (OpenAI/Anthropic/HuggingFace)
3. **Mode Démo** (fallback)

## 🔄 **Script de Démarrage Automatique**

### Windows (PowerShell)
```powershell
# start-ollama-tunnel.ps1
$env:OLLAMA_HOST="0.0.0.0:11434"
Start-Process -FilePath "ollama" -ArgumentList "serve" -WindowStyle Hidden
Start-Sleep -Seconds 5
Start-Process -FilePath "ngrok" -ArgumentList "http", "11434", "--host-header=localhost:11434"
```

### Linux/Mac
```bash
#!/bin/bash
# start-ollama-tunnel.sh
export OLLAMA_HOST="0.0.0.0:11434"
ollama serve &
sleep 5
ngrok http 11434 --host-header=localhost:11434
```

## 🐛 **Dépannage**

### Tunnel ne fonctionne pas
```bash
# Vérifier que Ollama est accessible
curl http://localhost:11434/api/tags

# Vérifier le tunnel
curl https://your-tunnel-url/api/tags
```

### Erreur CORS
```bash
# Ollama gère déjà CORS, mais si problème :
# Vérifier que OLLAMA_ORIGINS contient votre domaine Vercel
```

### Tunnel se ferme
```bash
# ngrok gratuit se ferme après 2h
# Solution : Script de redémarrage automatique
# Ou utiliser un compte payant ngrok
```

## 💡 **Conseils**

1. **Utilisez ngrok** pour commencer (le plus simple)
2. **Gardez votre PC allumé** quand vous voulez utiliser l'IA
3. **Utilisez un script** pour démarrer automatiquement
4. **Testez d'abord localement** avant de déployer
5. **Surveillez les logs** Vercel pour les erreurs

## 🚀 **Déploiement**

1. **Configurer le tunnel** sur votre PC
2. **Ajouter la variable d'environnement** sur Vercel
3. **Redéployer** l'application
4. **Tester** l'IA sur Vercel

Votre Ollama local sera maintenant accessible depuis Vercel ! 🎉

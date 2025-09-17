# 🚀 Démarrage Rapide - Tunnel Ollama

## ⚡ **Solution en 5 minutes**

### 1. **Installer ngrok**
```bash
# Télécharger depuis https://ngrok.com/download
# Ou via npm
npm install -g ngrok
```

### 2. **Configurer Ollama**
```bash
# Windows (PowerShell en admin)
$env:OLLAMA_HOST="0.0.0.0:11434"
ollama serve

# Linux/Mac
export OLLAMA_HOST="0.0.0.0:11434"
ollama serve
```

### 3. **Créer le tunnel**
```bash
# Dans un nouveau terminal
ngrok http 11434 --host-header=localhost:11434
```

### 4. **Copier l'URL**
Vous verrez quelque chose comme :
```
Forwarding    https://abc123.ngrok.io -> http://localhost:11434
```
**Copiez `https://abc123.ngrok.io`**

### 5. **Configurer Vercel**
1. Allez sur votre projet Vercel
2. Settings > Environment Variables
3. Ajoutez :
   - **Name** : `OLLAMA_TUNNEL_URL`
   - **Value** : `https://abc123.ngrok.io`
4. Redéployez

### 6. **Tester**
Votre IA Ollama fonctionne maintenant sur Vercel ! 🎉

## 🔄 **Scripts Automatiques**

### Windows
```powershell
# Exécuter en tant qu'administrateur
.\start-ollama-tunnel.ps1
```

### Linux/Mac
```bash
./start-ollama-tunnel.sh
```

## 🐛 **Problèmes Courants**

### "Ollama n'est pas accessible"
- Vérifiez que Ollama est démarré
- Vérifiez la configuration `OLLAMA_HOST="0.0.0.0:11434"`

### "Tunnel ne fonctionne pas"
- Vérifiez que ngrok est installé
- Vérifiez que le port 11434 est libre

### "Erreur sur Vercel"
- Vérifiez la variable d'environnement `OLLAMA_TUNNEL_URL`
- Vérifiez que le tunnel est actif

## 💡 **Conseils**

- **Gardez votre PC allumé** quand vous voulez utiliser l'IA
- **L'URL ngrok change** à chaque redémarrage (sauf compte payant)
- **Testez d'abord** avec `curl https://your-url.ngrok.io/api/tags`

## 🎯 **Résultat**

Votre application Vercel appellera maintenant directement votre Ollama local ! 🚀

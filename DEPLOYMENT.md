# Guide de Déploiement

## 🚀 **Déploiement sur Vercel (Mode Démo)**

L'application est configurée pour fonctionner sur Vercel en mode démo sans Ollama.

### Fonctionnalités en Mode Démo
- ✅ Interface de chat complète
- ✅ Coloration syntaxique du code
- ✅ Formatage markdown
- ✅ Animations fluides
- ✅ Réponses pré-programmées intelligentes

### Déploiement
1. **Connectez votre repository à Vercel**
2. **Configurez les variables d'environnement** (optionnel) :
   ```
   NEXT_PUBLIC_DEFAULT_MODEL=llama2
   ```
3. **Déployez** - Vercel détectera automatiquement le mode démo

## 🏠 **Déploiement Local (Mode Complet)**

Pour utiliser l'IA Ollama complète :

### Prérequis
- Node.js 18+
- Ollama installé localement

### Installation
```bash
# 1. Cloner le repository
git clone <votre-repo>
cd prompt-project

# 2. Installer les dépendances
npm install

# 3. Installer et démarrer Ollama
# Télécharger depuis https://ollama.ai
ollama serve

# 4. Télécharger un modèle
ollama pull llama2
# ou
ollama pull GandalfBaum/deepseek_r1-claude3.7:latest

# 5. Démarrer l'application
npm run dev
```

### Configuration Ollama
```bash
# Vérifier les modèles installés
ollama list

# Tester un modèle
ollama run llama2

# Vérifier que l'API fonctionne
curl http://127.0.0.1:11434/api/tags
```

## 🔧 **Variables d'Environnement**

### Vercel (Optionnel)
```env
NEXT_PUBLIC_DEFAULT_MODEL=llama2
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:11434
```

### Local
```env
OLLAMA_HOST=http://127.0.0.1:11434
NEXT_PUBLIC_DEFAULT_MODEL=GandalfBaum/deepseek_r1-claude3.7:latest
```

## 🎯 **Modes de Fonctionnement**

### Mode Démo (Vercel)
- Détection automatique en production
- Réponses pré-programmées intelligentes
- Interface complète sans IA
- Parfait pour la démonstration

### Mode Complet (Local)
- IA Ollama complète
- Tous les modèles disponibles
- Réponses en temps réel
- Développement et utilisation

## 🐛 **Dépannage**

### Erreur 500 sur Vercel
- **Cause** : Ollama n'est pas disponible sur Vercel
- **Solution** : L'application bascule automatiquement en mode démo

### Ollama ne répond pas localement
```bash
# Vérifier que Ollama est démarré
ollama serve

# Vérifier les modèles
ollama list

# Tester l'API
curl http://127.0.0.1:11434/api/tags
```

### Modèle non trouvé
```bash
# Installer le modèle
ollama pull <nom-du-modèle>

# Vérifier l'installation
ollama list
```

## 📱 **Fonctionnalités**

### Interface
- Chat en temps réel
- Messages avec avatars
- Scroll automatique
- Animations fluides

### Code
- Coloration syntaxique
- Support multi-langages
- Numérotation des lignes
- Bouton de copie

### Formatage
- Titres (# ## ###)
- Listes (- * + 1. 2. 3.)
- Citations (>)
- Liens [texte](url)
- Code inline `code`

## 🚀 **Prochaines Étapes**

1. **Testez l'application** en mode démo sur Vercel
2. **Clonez le repository** pour le mode complet
3. **Installez Ollama** pour l'IA complète
4. **Personnalisez** selon vos besoins

L'application est maintenant prête pour la production ! 🎉

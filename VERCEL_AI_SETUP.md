# Configuration IA pour Vercel

## 🚀 **Options pour avoir une IA sur Vercel**

### **Option 1 : Hugging Face (Gratuit) - Recommandée**

1. **Créer un compte** sur [Hugging Face](https://huggingface.co)
2. **Générer un token** :
   - Allez dans Settings > Access Tokens
   - Créez un nouveau token
3. **Configurer sur Vercel** :
   - Variables d'environnement > Add
   - Nom : `HUGGINGFACE_API_KEY`
   - Valeur : `hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### **Option 2 : OpenAI API (Payant)**

1. **Créer un compte** sur [OpenAI](https://openai.com)
2. **Générer une clé API** :
   - API Keys > Create new secret key
3. **Configurer sur Vercel** :
   - Variables d'environnement > Add
   - Nom : `OPENAI_API_KEY`
   - Valeur : `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### **Option 3 : Anthropic Claude (Payant)**

1. **Créer un compte** sur [Anthropic](https://anthropic.com)
2. **Générer une clé API** :
   - API Keys > Create Key
3. **Configurer sur Vercel** :
   - Variables d'environnement > Add
   - Nom : `ANTHROPIC_API_KEY`
   - Valeur : `sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## 🔧 **Configuration du Code**

### Pour Hugging Face (déjà configuré)
```typescript
// Le code est déjà configuré pour Hugging Face
// Il suffit d'ajouter la variable d'environnement
```

### Pour OpenAI (à ajouter)
```typescript
// Ajouter cette méthode dans AIService
private async tryOpenAI(request: ChatRequest): Promise<ChatResponse | null> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return null;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: request.messages,
        max_tokens: 2000,
        temperature: 0.7,
      })
    });

    if (!response.ok) return null;

    const data = await response.json();
    return {
      message: {
        id: Date.now().toString(),
        content: data.choices[0].message.content,
        role: "assistant",
        timestamp: new Date(),
      },
      usage: data.usage
    };
  } catch (error) {
    return null;
  }
}
```

## 📊 **Comparaison des Options**

| Service | Coût | Qualité | Limite | Facile |
|---------|------|---------|--------|--------|
| Hugging Face | Gratuit | Bonne | 1000 req/mois | ⭐⭐⭐⭐⭐ |
| OpenAI | Payant | Excellente | Selon crédits | ⭐⭐⭐⭐ |
| Anthropic | Payant | Excellente | Selon crédits | ⭐⭐⭐⭐ |
| Mode Démo | Gratuit | Basique | Illimité | ⭐⭐⭐⭐⭐ |

## 🎯 **Recommandation**

**Pour commencer** : Hugging Face (gratuit)
**Pour la production** : OpenAI ou Anthropic (payant)

## 🔄 **Déploiement**

1. **Choisir une option** ci-dessus
2. **Configurer la variable d'environnement** sur Vercel
3. **Redéployer** l'application
4. **Tester** l'IA

## 🐛 **Dépannage**

### L'IA ne répond pas
- Vérifier la variable d'environnement
- Vérifier les crédits/limites
- Regarder les logs Vercel

### Erreur 401/403
- Vérifier la clé API
- Vérifier les permissions

### Erreur 429
- Limite de taux atteinte
- Attendre ou augmenter les limites

## 💡 **Conseils**

1. **Commencez gratuit** avec Hugging Face
2. **Testez localement** avant de déployer
3. **Surveillez les coûts** pour les APIs payantes
4. **Utilisez le mode démo** comme fallback

// Utilitaires API pour l'intégration des modèles IA
// Ce fichier sera utilisé pour intégrer de vrais modèles IA et des APIs

// Interface pour un message de chat
export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

// Interface pour une requête de chat
export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

// Interface pour une réponse de chat
export interface ChatResponse {
  message: ChatMessage;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Classe de service IA pour l'intégration avec Ollama
export class AIService {
  private baseUrl: string;
  private model: string;
  private useApiRoute: boolean;

  constructor(baseUrl: string = "http://127.0.0.1:11434", model: string = "llama2", useApiRoute: boolean = false) {
    this.baseUrl = baseUrl;
    this.model = model;
    this.useApiRoute = useApiRoute;
  }

  // Méthode pour envoyer un message et recevoir une réponse via Ollama API
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    // Vérifier si on est en mode démo (Vercel)
    const isDemoMode = process.env.NODE_ENV === 'production' && !this.baseUrl.includes('127.0.0.1');
    
    if (isDemoMode) {
      // Essayer d'abord votre Ollama via tunnel, puis API externe, puis mode démo
      const tunnelResponse = await this.tryTunnelAPI(request);
      if (tunnelResponse) return tunnelResponse;
      
      const externalResponse = await this.tryExternalAPI(request);
      return externalResponse || this.getDemoResponse(request);
    }

    try {
      // Préparer les messages pour l'API Ollama
      const ollamaMessages = request.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Format pour l'API /api/generate d'Ollama
      const requestBody = {
        model: this.model,
        prompt: this.formatMessagesForGenerate(ollamaMessages),
        stream: false,
        options: {
          temperature: request.temperature || 0.7,
          num_predict: request.maxTokens || 2000,
        }
      };

      // Choisir l'endpoint selon la configuration
      const endpoint = this.useApiRoute ? '/api/ollama' : `${this.baseUrl}/api/generate`;
      
      // Appel à l'API Ollama
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        message: {
          id: Date.now().toString(),
          content: data.response,
          role: "assistant",
          timestamp: new Date(),
        },
        usage: {
          promptTokens: data.prompt_eval_count || 0,
          completionTokens: data.eval_count || 0,
          totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
        }
      };
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API Ollama:", error);
      
      // Fallback vers une réponse d'erreur
      return {
        message: {
          id: Date.now().toString(),
          content: "Désolé, je n'ai pas pu me connecter à l'API Ollama. Vérifiez que le serveur Ollama est démarré sur http://127.0.0.1:11434",
          role: "assistant",
          timestamp: new Date(),
        }
      };
    }
  }

  // Méthode pour essayer votre Ollama via tunnel
  private async tryTunnelAPI(request: ChatRequest): Promise<ChatResponse | null> {
    try {
      const tunnelUrl = process.env.OLLAMA_TUNNEL_URL;
      if (!tunnelUrl) return null;

      // Préparer les messages pour l'API Ollama
      const ollamaMessages = request.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const requestBody = {
        model: this.model,
        prompt: this.formatMessagesForGenerate(ollamaMessages),
        stream: false,
        options: {
          temperature: request.temperature || 0.7,
          num_predict: request.maxTokens || 2000,
        }
      };

      const response = await fetch(`${tunnelUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) return null;

      const data = await response.json();
      return {
        message: {
          id: Date.now().toString(),
          content: data.response,
          role: "assistant",
          timestamp: new Date(),
        },
        usage: {
          promptTokens: data.prompt_eval_count || 0,
          completionTokens: data.eval_count || 0,
          totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
        }
      };
    } catch (error) {
      console.error('Erreur tunnel Ollama:', error);
      return null;
    }
  }

  // Méthode pour essayer une API externe sur Vercel
  private async tryExternalAPI(request: ChatRequest): Promise<ChatResponse | null> {
    // Essayer OpenAI en premier
    const openaiResponse = await this.tryOpenAI(request);
    if (openaiResponse) return openaiResponse;

    // Essayer Anthropic
    const anthropicResponse = await this.tryAnthropic(request);
    if (anthropicResponse) return anthropicResponse;

    // Essayer Hugging Face en dernier
    const hfResponse = await this.tryHuggingFace(request);
    if (hfResponse) return hfResponse;

    return null;
  }

  // Essayer OpenAI
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
        usage: data.usage || { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
      };
    } catch (error) {
      return null;
    }
  }

  // Essayer Anthropic
  private async tryAnthropic(request: ChatRequest): Promise<ChatResponse | null> {
    try {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) return null;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 2000,
          messages: request.messages,
        })
      });

      if (!response.ok) return null;

      const data = await response.json();
      return {
        message: {
          id: Date.now().toString(),
          content: data.content[0].text,
          role: "assistant",
          timestamp: new Date(),
        },
        usage: data.usage || { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
      };
    } catch (error) {
      return null;
    }
  }

  // Essayer Hugging Face
  private async tryHuggingFace(request: ChatRequest): Promise<ChatResponse | null> {
    try {
      const apiKey = process.env.HUGGINGFACE_API_KEY;
      if (!apiKey) return null;

      const lastMessage = request.messages[request.messages.length - 1];
      const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: lastMessage.content,
          parameters: {
            max_length: 200,
            temperature: 0.7,
          }
        })
      });

      if (!response.ok) return null;

      const data = await response.json();
      const generatedText = data[0]?.generated_text || data.generated_text || "Je n'ai pas pu générer de réponse.";

      return {
        message: {
          id: Date.now().toString(),
          content: generatedText,
          role: "assistant",
          timestamp: new Date(),
        },
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
      };
    } catch (error) {
      return null;
    }
  }

  // Méthode pour les réponses démo sur Vercel
  private getDemoResponse(request: ChatRequest): ChatResponse {
    const lastMessage = request.messages[request.messages.length - 1];
    const userMessage = lastMessage.content.toLowerCase();
    
    let response = "";
    
    if (userMessage.includes("hello") || userMessage.includes("bonjour")) {
      response = "Bonjour ! Je suis en mode démo sur Vercel. Pour utiliser l'IA complète, veuillez déployer l'application localement avec Ollama.";
    } else if (userMessage.includes("code") || userMessage.includes("programmation")) {
      response = `Voici un exemple de code en JavaScript :

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculer les 10 premiers nombres de Fibonacci
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}
\`\`\`

*Note: Ceci est une réponse démo. Pour des réponses IA complètes, utilisez l'application localement avec Ollama.*`;
    } else if (userMessage.includes("aide") || userMessage.includes("help")) {
      response = `## 🚀 Mode Démo - Vercel

Cette application est déployée sur Vercel en mode démo. Voici ce que vous pouvez faire :

### Fonctionnalités Disponibles
- ✅ Interface de chat complète
- ✅ Coloration syntaxique du code
- ✅ Formatage markdown
- ✅ Animations fluides

### Pour l'IA Complète
Pour utiliser l'IA Ollama complète :
1. Clonez le repository
2. Installez Ollama localement
3. Lancez \`npm run dev\`
4. L'IA sera pleinement fonctionnelle

### Exemples de Questions
- Demandez des exemples de code
- Testez le formatage markdown
- Explorez l'interface utilisateur`;
    } else {
      response = `Je suis en mode démo sur Vercel ! 

Pour utiliser l'IA Ollama complète, veuillez :
1. Cloner ce repository
2. Installer Ollama sur votre machine
3. Lancer \`npm run dev\`

En attendant, vous pouvez tester l'interface et le formatage du code !`;
    }
    
    return {
      message: {
        id: Date.now().toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      },
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      }
    };
  }

  // Méthode privée pour formater les messages pour l'API /api/generate
  private formatMessagesForGenerate(messages: Array<{role: string, content: string}>): string {
    return messages.map(msg => {
      if (msg.role === 'user') {
        return `Human: ${msg.content}`;
      } else if (msg.role === 'assistant') {
        return `Assistant: ${msg.content}`;
      }
      return msg.content;
    }).join('\n\n') + '\n\nAssistant:';
  }

}

// Configuration pour différents modèles Ollama
export const AI_MODELS = {
  LLAMA2: "llama2",
  LLAMA3: "llama3",
  CODELLAMA: "codellama",
  MISTRAL: "mistral",
  NEURAL_CHAT: "neural-chat",
  STARCODER: "starcoder",
} as const;

export type AIModel = typeof AI_MODELS[keyof typeof AI_MODELS];

// Configuration par défaut
export const DEFAULT_CONFIG = {
  model: "GandalfBaum/deepseek_r1-claude3.7:latest",
  temperature: 0.7,
  maxTokens: 2000,
} as const;

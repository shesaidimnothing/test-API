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

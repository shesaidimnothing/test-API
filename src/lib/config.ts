// Configuration file for the AI Assistant application

export const CONFIG = {
  // API Configuration
  API: {
    // Base URL for Ollama API
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:11434",
    
    // API Key (not needed for local Ollama)
    API_KEY: process.env.NEXT_PUBLIC_API_KEY || "",
    
    // Default model to use (Ollama model)
    DEFAULT_MODEL: process.env.NEXT_PUBLIC_DEFAULT_MODEL || "GandalfBaum/deepseek_r1-claude3.7:latest",
    
    // Request timeout in milliseconds
    TIMEOUT: 30000,
  },
  
  // UI Configuration
  UI: {
    // Maximum number of messages to keep in memory
    MAX_MESSAGES: 100,
    
    // Maximum height for the chat container
    CHAT_HEIGHT: "600px",
    
    // Auto-scroll to bottom when new messages arrive
    AUTO_SCROLL: true,
    
    // Show timestamps on messages
    SHOW_TIMESTAMPS: true,
    
    // Enable dark mode by default
    DEFAULT_DARK_MODE: false,
  },
  
  // Chat Configuration
  CHAT: {
    // Default temperature for AI responses (0.0 to 1.0)
    DEFAULT_TEMPERATURE: 0.7,
    
    // Maximum tokens for AI responses
    MAX_TOKENS: 2000,
    
    // System prompt for the AI
    SYSTEM_PROMPT: "You are a helpful AI assistant. Provide clear, accurate, and helpful responses to user questions.",
    
    // Welcome message
    WELCOME_MESSAGE: "Hello! I&apos;m your AI assistant. How can I help you today?",
  },
  
  // Features
  FEATURES: {
    // Enable message history persistence
    PERSIST_HISTORY: false,
    
    // Enable typing indicators
    TYPING_INDICATOR: true,
    
    // Enable message reactions
    MESSAGE_REACTIONS: false,
    
    // Enable file uploads
    FILE_UPLOAD: false,
    
    // Enable voice input
    VOICE_INPUT: false,
  },
} as const;

// Environment validation
export const validateConfig = () => {
  const requiredEnvVars: string[] = [
    // Add any required environment variables here
    // 'NEXT_PUBLIC_API_KEY',
  ];
  
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );
  
  if (missingVars.length > 0) {
    console.warn(
      `Missing environment variables: ${missingVars.join(", ")}. Using demo mode.`
    );
  }
  
  return missingVars.length === 0;
};

// Export types for TypeScript
export type Config = typeof CONFIG;
export type APIConfig = typeof CONFIG.API;
export type UIConfig = typeof CONFIG.UI;
export type ChatConfig = typeof CONFIG.CHAT;
export type FeaturesConfig = typeof CONFIG.FEATURES;

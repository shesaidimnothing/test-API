"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage as ChatMessageType, AIService, DEFAULT_CONFIG } from "@/lib/api";
import ChatMessage from "@/components/ChatMessage";
import LoadingIndicator from "@/components/LoadingIndicator";

export default function Home() {
  // États pour la gestion des messages et de l'interface
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  
  // Références pour le scroll automatique et la textarea
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Initialisation du service IA (dans une vraie app, cela viendrait des variables d'environnement)
  const aiService = new AIService("demo-key");

  // Fonction pour faire défiler automatiquement vers le bas des messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effet pour faire défiler vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auto-redimensionnement de la textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Gestionnaire de soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Création du message utilisateur
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    // Ajout du message utilisateur et réinitialisation de l'input
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Utilisation du service IA pour obtenir une réponse
      const response = await aiService.sendMessage({
        messages: [...messages, userMessage],
        ...DEFAULT_CONFIG,
      });
      
      setMessages(prev => [...prev, response.message]);
    } catch (error) {
      console.error("Erreur lors de la récupération de la réponse IA:", error);
      // Message de fallback en cas d'erreur
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        content: "Désolé, j&apos;ai rencontré une erreur. Veuillez réessayer plus tard.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* En-tête - Icône en haut à droite */}
      <motion.header 
        className="absolute top-0 right-0 p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.div 
          className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-black text-sm font-medium">P</span>
        </motion.div>
      </motion.header>

      {/* Contenu principal - Centré */}
      <main className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-4xl space-y-6">
          {/* Titre principal */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.h1 
              className="text-5xl font-light text-white"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <motion.span 
                className="text-orange-500"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ delay: 1, duration: 0.5 }}
              >*</motion.span> AI Assistant is ready!
            </motion.h1>
          </motion.div>

          {/* Zone des messages - Toujours visible, au-dessus du prompt */}
          <motion.div 
            className="bg-white rounded-2xl p-8 h-96 overflow-y-auto shadow-2xl border-2 border-gray-200"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            whileHover={{ scale: 1.01 }}
          >
            {messages.length === 0 ? (
              <motion.div 
                className="flex flex-col items-center justify-center h-full text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <motion.div 
                  className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, duration: 0.5, type: "spring" }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <span className="text-white font-bold text-2xl">AI</span>
                </motion.div>
                <motion.h2 
                  className="text-3xl font-semibold text-black mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  Welcome to AI Assistant
                </motion.h2>
                <motion.p 
                  className="text-gray-600 max-w-md mb-8 text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                >
                  Start a conversation by typing your message below. I&apos;m here to help with any questions or tasks you might have.
                </motion.p>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ 
                        delay: index * 0.1, 
                        duration: 0.4,
                        type: "spring",
                        stiffness: 100
                      }}
                    >
                      <ChatMessage message={message} />
                    </motion.div>
                  ))}
                </AnimatePresence>
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <LoadingIndicator />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <div ref={messagesEndRef} />
          </motion.div>

          {/* Boîte de saisie principale */}
          <motion.form 
            onSubmit={handleSubmit} 
            className="bg-white rounded-2xl p-4 shadow-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 focus-within:border-gray-400 focus-within:shadow-3xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{ scale: 1.01 }}
            whileFocus={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              {/* Zone de saisie */}
              <div className="flex-1 flex items-center">
                <motion.textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="How can I help you?"
                  className="w-full resize-none bg-transparent text-black placeholder-gray-400 focus:outline-none min-h-[52px] max-h-[200px] text-lg leading-relaxed py-3"
                  rows={1}
                  disabled={isLoading}
                  style={{ 
                    textAlign: &apos;left&apos;,
                    display: &apos;flex&apos;,
                    alignItems: &apos;center&apos;
                  }}
                  whileFocus={{ scale: 1.02 }}
                />
              </div>

              {/* Bouton d'envoi */}
              <motion.button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 bg-gray-800 hover:bg-black disabled:bg-gray-300 text-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, duration: 0.3, type: "spring" }}
              >
                <motion.svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  strokeWidth={2}
                  animate={{ rotate: input.trim() ? 0 : 0 }}
                  whileHover={{ rotate: 15 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </motion.svg>
              </motion.button>
            </div>
          </motion.form>

          {/* Barre de statut */}
          <motion.div 
            className="bg-white rounded-2xl px-6 py-4 flex items-center justify-between border-2 border-gray-200 shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            whileHover={{ scale: 1.01 }}
          >
            <motion.span 
              className="text-gray-600 text-sm font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              Ready to assist you with any questions
            </motion.span>
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3].map((index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full shadow-sm ${
                    index === 0 ? &apos;bg-green-500&apos; : 
                    index === 1 || index === 3 ? &apos;bg-orange-500&apos; : &apos;bg-red-500&apos;
                  }`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    delay: 1.2 + index * 0.1, 
                    duration: 0.3,
                    type: "spring"
                  }}
                  whileHover={{ scale: 1.5 }}
                />
              ))}
              <motion.svg 
                className="w-4 h-4 text-gray-500 ml-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                strokeWidth={2}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6, duration: 0.3 }}
                whileHover={{ x: 5 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </motion.svg>
            </div>
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
}

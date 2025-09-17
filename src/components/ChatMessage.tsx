import { motion } from "framer-motion";
import { ChatMessage as ChatMessageType } from "@/lib/api";

interface ChatMessageProps {
  message: ChatMessageType;
  isLast?: boolean;
}

export default function ChatMessage({ message, isLast = false }: ChatMessageProps) {
  return (
    <motion.div
      className={`flex gap-4 ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ scale: 1.02 }}
    >
      {message.role === "assistant" && (
        <motion.div 
          className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.2, 
            duration: 0.5,
            type: "spring",
            stiffness: 200
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <span className="text-white font-medium text-sm">AI</span>
        </motion.div>
      )}
      <motion.div
        className={`max-w-[80%] rounded-2xl px-6 py-4 ${
          message.role === "user"
            ? "bg-black text-white"
            : "bg-gray-100 text-black border border-gray-300"
        }`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          delay: 0.1, 
          duration: 0.3,
          type: "spring",
          stiffness: 150
        }}
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
        }}
      >
        <motion.p 
          className="whitespace-pre-wrap text-base leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {message.content}
        </motion.p>
        <motion.p 
          className="text-xs opacity-60 mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          {message.timestamp.toLocaleTimeString()}
        </motion.p>
      </motion.div>
      {message.role === "user" && (
        <motion.div 
          className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0"
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.2, 
            duration: 0.5,
            type: "spring",
            stiffness: 200
          }}
          whileHover={{ scale: 1.1, rotate: -5 }}
        >
          <span className="text-white font-medium text-sm">U</span>
        </motion.div>
      )}
    </motion.div>
  );
}

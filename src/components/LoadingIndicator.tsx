import { motion } from "framer-motion";

// Composant pour afficher un indicateur de chargement avec animations
export default function LoadingIndicator() {
  return (
    <motion.div 
      className="flex gap-4 justify-start"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Avatar de l'assistant IA */}
      <motion.div 
        className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          duration: 0.5,
          type: "spring",
          stiffness: 200
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <span className="text-white font-medium text-sm">AI</span>
      </motion.div>
      
      {/* Bulle de chargement */}
      <motion.div 
        className="bg-gray-100 rounded-2xl px-6 py-4 border border-gray-300"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          delay: 0.1, 
          duration: 0.3,
          type: "spring",
          stiffness: 150
        }}
      >
        {/* Points de chargement animés */}
        <div className="flex gap-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-gray-500 rounded-full"
              animate={{ 
                y: [0, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

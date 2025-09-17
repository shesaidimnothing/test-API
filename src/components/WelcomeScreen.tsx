import { motion } from "framer-motion";

// Composant d'écran d'accueil avec animations
export default function WelcomeScreen() {
  // Données des fonctionnalités à afficher
  const features = [
    {
      icon: "💡",
      title: "Ask Questions",
      description: "Get answers to complex questions across various topics"
    },
    {
      icon: "🛠️",
      title: "Get Help",
      description: "Receive assistance with coding, writing, and problem-solving"
    },
    {
      icon: "🎯",
      title: "Be Creative",
      description: "Brainstorm ideas, write content, and explore creative solutions"
    },
    {
      icon: "📚",
      title: "Learn & Grow",
      description: "Expand your knowledge with explanations and tutorials"
    }
  ];

  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-full text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo principal de l'assistant IA */}
      <motion.div 
        className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-6"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          delay: 0.2, 
          duration: 0.6,
          type: "spring",
          stiffness: 200
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <span className="text-white font-bold text-2xl">AI</span>
      </motion.div>
      
      {/* Titre de bienvenue */}
      <motion.h2 
        className="text-3xl font-semibold text-black mb-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Welcome to AI Assistant
      </motion.h2>
      
      {/* Description */}
      <motion.p 
        className="text-gray-600 max-w-md mb-8 text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Start a conversation by typing your message below. I'm here to help with any questions or tasks you might have.
      </motion.p>
      
      {/* Grille des fonctionnalités */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="bg-white rounded-2xl p-6 text-left border border-gray-200 shadow-sm"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 1 + index * 0.1, 
              duration: 0.4,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              y: -5
            }}
          >
            {/* Titre de la fonctionnalité */}
            <motion.h3 
              className="font-semibold text-black mb-3 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.3 }}
            >
              {feature.icon} {feature.title}
            </motion.h3>
            
            {/* Description de la fonctionnalité */}
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 + index * 0.1, duration: 0.3 }}
            >
              {feature.description}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

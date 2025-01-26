
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Brain, Sparkles, Star } from "lucide-react";

export function LoadingAnimation() {
  const [dots, setDots] = useState("");
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="relative">
        <motion.div
          className="w-24 h-24 border-4 border-purple-500 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            rotate: 360,
            borderColor: ["#9333EA", "#EC4899", "#3B82F6", "#9333EA"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Brain className="w-12 h-12 text-purple-400" />
        </motion.div>

        {/* Orbiting elements */}
        {[0, 120, 240].map((rotation, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2"
            initial={{ rotate: rotation }}
            animate={{
              rotate: [rotation, rotation + 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: {
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              },
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              },
            }}
          >
            <div className="relative -top-12">
              {i === 0 ? (
                <Sparkles className="w-6 h-6 text-yellow-400" />
              ) : i === 1 ? (
                <Star className="w-6 h-6 text-blue-400" />
              ) : (
                <motion.div
                  className="w-4 h-4 bg-pink-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl text-white text-center space-y-2"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          L'IA analyse vos réponses{dots}
        </motion.div>
        <motion.div
          className="text-sm opacity-75"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Veuillez patienter quelques instants
        </motion.div>
      </motion.div>
    </div>
  );
}

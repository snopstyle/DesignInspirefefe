import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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

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
    <div className="flex flex-col items-center justify-center space-y-6">
      <motion.div
        className="w-16 h-16 border-4 border-blue-500 rounded-full"
        animate={{
          rotate: 360,
          borderColor: ["#3B82F6", "#8B5CF6", "#EC4899", "#3B82F6"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl text-white text-center"
      >
        L'IA analyse vos réponses{dots}
        <br />
        <span className="text-sm opacity-75">Veuillez patienter quelques instants</span>
      </motion.div>
    </div>
  );
}

import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function WelcomePage() {
  const [_, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <motion.h1 
        className="text-[120px] font-black text-transparent bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 bg-clip-text mb-12 font-['Unbounded']"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        GURU
      </motion.h1>

      <motion.p 
        className="max-w-xl text-center text-xl text-gray-400 mb-12 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Hey! 👋 T'es prêt(e) à découvrir ton futur ? 
        <br/><br/>
        Pas de stress, on est là pour t'aider à trouver ta voie. 
        Grâce à notre IA de ouf, on va matcher ton profil avec les formations qui te correspondent vraiment. 
        Plus de prise de tête, juste des choix qui te ressemblent !
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Button 
          onClick={() => navigate("/landing")} 
          className="w-32 h-16 flex items-center justify-center text-2xl rounded-full bg-black hover:bg-gradient-to-r hover:from-purple-500/80 hover:via-gray-600/80 hover:to-purple-700/80 text-white transition-all duration-300 transform hover:scale-105"
        >
          🚀 🚀 🚀
        </Button>
      </motion.div>
    </div>
  );
}
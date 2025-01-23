
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";

export default function WelcomePage() {
  const [_, navigate] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const { setTempUserId } = useUser();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!username.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un pseudo",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/users/temp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const data = await response.json();
      if (data.success && data.id) {
        setTempUserId(data.id);
        setIsOpen(false);
        navigate("/landing");
      } else {
        throw new Error('Invalid server response');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <motion.h1 
        className="text-[120px] font-black text-transparent bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 bg-clip-text mb-12 font-['Unbounded'] animate-gradient"
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
          onClick={() => setIsOpen(true)} 
          className="w-32 h-16 flex items-center justify-center text-2xl rounded-full bg-black text-white transition-all duration-500 transform hover:scale-105 hover:bg-gradient-to-r hover:from-purple-500/60 hover:via-gray-600/60 hover:to-purple-700/60 hover:animate-gradient-fast hover:bg-[length:400%_400%]"
        >
          🚀 🚀 🚀
        </Button>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-black/80 backdrop-blur-sm border-white/20">
          <DialogHeader>
            <DialogTitle>Choisis ton pseudo</DialogTitle>
            <DialogDescription>
              Entre un pseudo pour commencer ton voyage
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Ton pseudo"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-black/50 border-white/20"
            />
            <Button 
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500"
            >
              Commencer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
  const { createTempUser, isAuthenticated } = useUser();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username",
        variant: "destructive"
      });
      return;
    }

    try {
      await createTempUser.mutateAsync(username);
      setIsOpen(false);

      // Wait a short moment for session to be properly saved
      await new Promise(resolve => setTimeout(resolve, 500));

      navigate("/landing");
    } catch (error) {
      console.error('Error in handleSubmit:', error);
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
        Hey! 👋 Ready to discover your future? 
        <br/><br/>
        No stress, we're here to help you find your way. 
        With our AI, we'll match your profile with trainings that really suit you. 
        No more headaches, just choices that look like you!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Button 
          onClick={() => setIsOpen(true)}
          disabled={createTempUser.isPending} 
          className="w-32 h-16 flex items-center justify-center text-2xl rounded-full bg-black text-white transition-all duration-500 transform hover:scale-105 hover:bg-gradient-to-r hover:from-purple-500/60 hover:via-gray-600/60 hover:to-purple-700/60 hover:animate-gradient-fast hover:bg-[length:400%_400%]"
        >
          {createTempUser.isPending ? '⏳' : '🚀 🚀 🚀'}
        </Button>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-black/80 backdrop-blur-sm border-white/20">
          <DialogHeader>
            <DialogTitle>Choose your username</DialogTitle>
            <DialogDescription>
              Enter a username to start your journey
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-black/50 border-white/20"
              disabled={createTempUser.isPending}
            />
            <Button 
              onClick={handleSubmit}
              disabled={createTempUser.isPending}
              className="w-full bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500"
            >
              {createTempUser.isPending ? 'Creating...' : 'Start'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
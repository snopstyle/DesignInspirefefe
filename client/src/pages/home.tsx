
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { GradientBackground } from "@/components/layout/gradient-background";
import { Brain, Target, Compass, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [, setLocation] = useLocation();

  const features = [
    {
      title: "Profil Unique",
      description: "Découvrez vos traits de personnalité et vos aptitudes naturelles",
      icon: Brain
    },
    {
      title: "Ambitions",
      description: "Identifiez vos domaines de prédilection et aspirations",
      icon: Target
    },
    {
      title: "Orientation",
      description: "Trouvez votre voie professionnelle idéale",
      icon: Compass
    },
    {
      title: "Potentiel",
      description: "Révélez vos talents cachés et vos forces",
      icon: Sparkles
    }
  ];

  return (
    <GradientBackground>
      <div className="container mx-auto min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl space-y-8"
        >
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Révélez Votre Potentiel
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Un questionnaire intelligent pour découvrir votre profil et construire votre avenir
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20 transition-colors h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <feature.icon className="h-6 w-6 text-purple-400" />
                      <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-white/70">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          <Button
            onClick={() => setLocation("/quiz")}
            size="lg"
            className="w-full max-w-md mx-auto bg-white/20 hover:bg-white/30 text-white font-bold backdrop-blur-sm"
          >
            Commencer le Quiz
          </Button>
        </motion.div>
      </div>
    </GradientBackground>
  );
}

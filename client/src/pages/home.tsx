
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { GradientBackground } from "@/components/layout/gradient-background";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, Target, Compass, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  console.log("Home component mounting");
  const [, setLocation] = useLocation();

  const features = [
    {
      title: "Découvrez-vous",
      description: "Un questionnaire unique pour révéler votre profil professionnel",
      icon: Brain
    },
    {
      title: "Orientez-vous",
      description: "Identifiez les formations qui vous correspondent",
      icon: Target
    },
    {
      title: "Projetez-vous",
      description: "Explorez les métiers qui vous passionnent",
      icon: Compass
    },
    {
      title: "Lancez-vous",
      description: "Des recommandations personnalisées pour votre avenir",
      icon: Sparkles
    }
  ];

  return (
    <GradientBackground>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Votre Avenir, Votre Choix
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Commencez votre voyage vers une orientation professionnelle éclairée
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/10 hover:bg-white/20 transition-colors border-white/20 h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <feature.icon className="h-8 w-8 text-purple-400" />
                      <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-white/70 text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={() => setLocation("/quiz")}
              size="lg"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 text-lg rounded-xl shadow-lg"
            >
              Démarrer le Questionnaire
            </Button>
          </motion.div>
        </div>
      </div>
    </GradientBackground>
  );
}

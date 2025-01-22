
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { GradientBackground } from "@/components/layout/gradient-background";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, Target, Compass, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [, setLocation] = useLocation();

  const features = [
    {
      title: "Découvrez-vous",
      description: "Un questionnaire unique pour révéler votre profil",
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
            Votre Avenir, Votre Choix
          </h1>
          <p className="text-2xl text-gray-300">
            Commencez votre voyage vers une orientation professionnelle éclairée
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-none hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-2 rounded-full bg-purple-500/20">
                    <feature.icon className="h-8 w-8 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-white mb-2">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-300 text-lg">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Button
            onClick={() => setLocation("/quiz")}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 px-12 text-xl rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Démarrer le Questionnaire
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

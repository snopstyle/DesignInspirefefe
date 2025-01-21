import { useLocation } from "wouter";
import { GradientBackground } from "@/components/layout/gradient-background";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Brain, Search, User, Trophy, Crown, BookOpen, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { SocialIcon } from 'react-social-icons'; // Added import

export default function Landing() {
  const [, setLocation] = useLocation();

  const features = [
    {
      title: "Quiz d'orientation",
      description: "Découvrez votre profil unique à travers notre quiz interactif",
      icon: Brain,
      path: "/quiz"
    },
    {
      title: "Recherche de formation",
      description: "Trouvez la formation idéale selon vos critères",
      icon: Search,
      path: "/search"
    },
    {
      title: "Profil",
      description: "Consultez et gérez votre profil personnel",
      icon: User,
      path: "/profile"
    },
    {
      title: "Chat avec le Guru",
      description: "Obtenez des conseils personnalisés de notre expert en orientation",
      icon: MessageCircle,
      path: "/chat"
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
            <h1 className="text-4xl font-bold">Votre Parcours D'orientation</h1>
            <p className="text-xl text-white/80">Commencez votre aventure</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
            {features.slice(0, 2).map((feature) => (
              <motion.div
                key={feature.title}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="h-full"
              >
                <Card 
                  className="cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20 transition-colors h-full"
                  onClick={() => setLocation(feature.path)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl mt-4">{feature.title}</CardTitle>
                    <CardDescription className="text-white/70">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-full"
            >
              <Card 
                className="cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20 transition-colors h-full"
                onClick={() => setLocation(features[2].path)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <User className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl mt-4">{features[2].title}</CardTitle>
                  <CardDescription className="text-white/70">
                    {features[2].description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-full"
            >
              <Card 
                className="cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20 transition-colors h-full"
                onClick={() => setLocation(features[3].path)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <MessageCircle className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl mt-4">{features[3].title}</CardTitle>
                  <CardDescription className="text-white/70">
                    {features[3].description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>

          <Card className="bg-gray-900/20 border-gray-500/30 backdrop-blur-sm mt-8 mx-auto max-w-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Crown className="h-6 w-6 text-purple-400" />
                <CardTitle>Zone Premium</CardTitle>
              </div>
              <CardDescription className="text-white/70">
                Débloquez des fonctionnalités exclusives
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 text-white/60">
                <BookOpen className="h-5 w-5" />
                <span>Entretien avec un conseiller</span>
              </div>
              <div className="flex items-center gap-3 text-white/60">
                <Trophy className="h-5 w-5" />
                <span>Service d'aide à l'inscription</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </GradientBackground>
  );
}
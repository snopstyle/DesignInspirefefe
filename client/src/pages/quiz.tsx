import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { Brain, Target, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GradientBackground } from "@/components/layout/gradient-background";
import { useQuiz } from "@/hooks/use-quiz";
import { QuestionCard } from "@/components/quiz/question-card";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function Quiz() {
  const { user } = useUser();
  const { toast } = useToast();
  const [showWelcome, setShowWelcome] = useState(true);
  const quizProps = useQuiz();


  const features = [
    {
      title: "QUESTIONNAIRE DU PROFIL PSYCHO-SOCIAL",
      description: "Explorez vos traits de personnalité, vos préférences de travail et vos aptitudes naturelles pour mieux comprendre votre façon d'être et d'interagir.",
      icon: Brain
    },
    {
      title: "PASSIONS & INTÉRÊTS",
      description: "Identifiez vos domaines de prédilection, vos motivations profondes et vos aspirations professionnelles pour orienter votre parcours vers des domaines qui vous passionnent.",
      icon: Target
    },
    {
      title: "PROJET D'ÉTUDES",
      description: "Définissez les aspects pratiques de votre formation : budget, durée, localisation et critères prioritaires pour choisir votre établissement idéal.",
      icon: BookOpen
    }
  ];

  const isLoading = quizProps.isLoading;

  if (isLoading) {
    return (
      <GradientBackground>
        <div className="container mx-auto min-h-screen flex flex-col items-center justify-center">
          <Card className="w-full max-w-2xl p-8 bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p>Chargement...</p>
            </div>
          </Card>
        </div>
      </GradientBackground>
    );
  }

  if (!user) {
    window.location.href = "/auth";
    return null;
  }

  if (showWelcome) {
    return (
      <GradientBackground>
        <div className="container mx-auto min-h-screen flex flex-col items-center justify-center p-4">
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6 drop-shadow-lg">
                Bienvenue dans votre Parcours d'Orientation
              </h1>
              <p className="text-xl md:text-2xl text-white/80">
                Découvrez votre profil à travers trois étapes essentielles
              </p>
            </motion.div>

            <Card className="w-full max-w-4xl bg-background/80 backdrop-blur-sm">
              <CardContent className="space-y-6 p-8">
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2, duration: 0.6 }}
                    >
                      <div className="p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30">
                            <feature.icon className="h-8 w-8 text-purple-300" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-white/70">{feature.description}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button 
                    onClick={() => setShowWelcome(false)}
                    className="w-full bg-gradient-neo from-orange-500/80 to-purple-500/80 hover:from-orange-500 hover:to-purple-500 text-white py-6 text-lg"
                  >
                    Commencer le Quiz
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </AnimatePresence>
        </div>
      </GradientBackground>
    );
  }

  const { currentQuestion, handleAnswer: onAnswer, answers } = quizProps;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  if (!currentQuestion) {
    return null;
  }

  return (
    <GradientBackground>
      <div className="container mx-auto min-h-screen py-8">
        <QuestionCard 
          question={currentQuestion}
          onAnswer={onAnswer}
          currentAnswer={currentAnswer}
        />
      </div>
    </GradientBackground>
  );
}
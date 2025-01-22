import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { Brain, Target, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GradientBackground } from "@/components/layout/gradient-background";
import { PageTransition } from "@/components/layout/page-transition";
import { useQuiz } from "@/hooks/use-quiz";
import { QuestionCard } from "@/components/quiz/question-card";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  },
  exit: { opacity: 0 }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};

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
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-full max-w-2xl p-8 bg-background/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p>Chargement...</p>
              </div>
            </Card>
          </motion.div>
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
        <PageTransition className="container mx-auto min-h-screen flex flex-col items-center justify-center p-4">
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 mb-4">
              Découvrez Votre Voie
            </h1>
            <p className="text-lg md:text-xl text-white/80">
              Trois étapes pour révéler votre potentiel
            </p>
          </motion.div>

          <Card className="w-full max-w-4xl bg-background/80 backdrop-blur-sm">
            <CardContent className="space-y-6 p-8">
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    variants={itemVariants}
                    className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors transform hover:scale-[1.02] transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-gradient-to-r from-orange-500/20 to-pink-500/20">
                        <feature.icon className="h-8 w-8 text-orange-300" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-white/70">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button 
                  onClick={() => setShowWelcome(false)}
                  className="w-full bg-gradient-neo from-orange-500/80 to-purple-500/80 hover:from-orange-500 hover:to-purple-500 text-white py-6 text-lg transform hover:scale-[1.02] transition-all duration-300"
                >
                  Commencer le Quiz
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </PageTransition>
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
      <PageTransition className="container mx-auto min-h-screen py-8">
        <AnimatePresence mode="wait">
          <QuestionCard 
            key={currentQuestion.id}
            question={currentQuestion}
            onAnswer={onAnswer}
            currentAnswer={currentAnswer}
          />
        </AnimatePresence>
      </PageTransition>
    </GradientBackground>
  );
}
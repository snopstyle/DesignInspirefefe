import { useQuiz } from "@/hooks/use-quiz";
import { QuestionCard } from "@/components/quiz/question-card";
import { GradientBackground } from "@/components/layout/gradient-background";
import { Loader2, Brain, Flame, GraduationCap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useUser } from "@/hooks/use-user";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Quiz() {
  const { user, isLoading } = useUser();
  const [showWelcome, setShowWelcome] = useState(true);
  const quizProps = useQuiz();

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
          <Card className="w-full max-w-3xl bg-transparent backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Découvrez Votre Véritable Voie Professionnelle</CardTitle>
              <CardDescription className="text-lg text-center mt-2 space-y-4">
                <p className="text-white/90">
                  Ce questionnaire personnalisé va révéler vos talents cachés et vous guider vers des opportunités professionnelles qui vous correspondent vraiment. En moins de 15 minutes, explorez vos aspirations et définissez votre avenir avec précision.
                </p>
                <p className="text-white/80">
                  Notre approche unique en trois étapes analyse votre personnalité, vos passions et vos objectifs pour vous proposer un parcours d'études sur mesure.
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="cursor-pointer bg-white/10 hover:bg-white/15 backdrop-blur-sm transition-colors rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Brain className="w-8 h-8 text-orange-400/90" />
                    <h3 className="text-xl font-bold">QUESTIONNAIRE DU PROFIL PSYCHO-SOCIAL</h3>
                  </div>
                  <p className="text-white/70">Explorez vos traits de personnalité, vos préférences de travail et vos aptitudes naturelles pour mieux comprendre votre façon d'être et d'interagir.</p>
                </div>

                <div className="cursor-pointer bg-white/10 hover:bg-white/15 backdrop-blur-sm transition-colors rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Flame className="w-8 h-8 text-purple-400/90" />
                    <h3 className="text-xl font-bold">PASSIONS & INTÉRÊTS</h3>
                  </div>
                  <p className="text-white/70">Identifiez vos domaines de prédilection, vos motivations profondes et vos aspirations professionnelles pour orienter votre parcours vers des domaines qui vous passionnent.</p>
                </div>

                <div className="cursor-pointer bg-white/10 hover:bg-white/15 backdrop-blur-sm transition-colors rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <GraduationCap className="w-8 h-8 text-blue-400/90" />
                    <h3 className="text-xl font-bold">PROJET D'ÉTUDES</h3>
                  </div>
                  <p className="text-white/70">Définissez les aspects pratiques de votre formation : budget, durée, localisation et critères prioritaires pour choisir votre établissement idéal.</p>
                </div>
              </div>

              <Button 
                onClick={() => setShowWelcome(false)}
                className="w-full bg-gradient-to-r from-orange-500/80 to-purple-500/80 hover:from-orange-500 hover:to-purple-500 text-white py-6 text-lg"
              >
                Commencer le Quiz
              </Button>
            </CardContent>
          </Card>
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
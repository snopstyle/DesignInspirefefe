import { useQuiz } from "@/hooks/use-quiz";
import { QuestionCard } from "@/components/quiz/question-card";
import { GradientBackground } from "@/components/layout/gradient-background";
import { Loader2, Brain, Flame, GraduationCap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Quiz() {
  const [showWelcome, setShowWelcome] = useState(true);
  const quizProps = useQuiz();
  const [isCreatingTempUser, setIsCreatingTempUser] = useState(false);

  useEffect(() => {
    // Function to create temporary user
    const createTempUser = async () => {
      if (isCreatingTempUser) return; // Prevent multiple calls

      setIsCreatingTempUser(true);
      try {
        const response = await fetch('/api/temp-user', {
          method: 'POST',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to create temporary user');
        }

        const data = await response.json();
        sessionStorage.setItem('tempUser', JSON.stringify(data));
      } catch (error) {
        console.error('Error creating temp user:', error);
      } finally {
        setIsCreatingTempUser(false);
      }
    };

    // Check if we need to create a temp user
    if (!sessionStorage.getItem('tempUser')) {
      createTempUser();
    }
  }, []); // Empty dependency array - run once on mount

  if (isCreatingTempUser) {
    return (
      <GradientBackground>
        <div className="container mx-auto min-h-screen flex flex-col items-center justify-center">
          <Card className="w-full max-w-2xl p-8 bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p>Création d'une session temporaire...</p>
            </div>
          </Card>
        </div>
      </GradientBackground>
    );
  }

  if (showWelcome) {
    return (
      <GradientBackground>
        <div className="container mx-auto min-h-screen flex flex-col items-center justify-center p-4">
          <Card className="w-full max-w-3xl bg-transparent backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl text-center font-bold text-white">Révélez Votre Potentiel, Construisez Votre Avenir</CardTitle>
              <CardDescription className="text-lg text-center mt-2 space-y-4">
                <div className="text-white space-y-2">
                  <p className="font-bold">15 minutes pour découvrir votre voie professionnelle idéale !</p>
                  <ul className="list-disc list-inside text-white font-medium space-y-1">
                    <li>Analyse précise de votre personnalité et vos talents</li>
                    <li>Identification de vos véritables motivations</li>
                    <li>Parcours d'études personnalisé et sur mesure</li>
                  </ul>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="cursor-pointer bg-white/10 hover:bg-white/15 hover:scale-[1.02] transition-all rounded-lg p-4 will-change-transform">
                  <div className="flex items-center gap-3 mb-2">
                    <Brain className="w-8 h-8 text-orange-400/90" />
                    <h3 className="text-xl font-bold">QUESTIONNAIRE DU PROFIL PSYCHO-SOCIAL</h3>
                  </div>
                  <p className="text-white">Explorez vos traits de personnalité, vos préférences de travail et vos aptitudes naturelles pour mieux comprendre votre façon d'être et d'interagir.</p>
                </div>

                <div className="cursor-pointer bg-white/10 hover:bg-white/15 hover:scale-[1.02] transition-all rounded-lg p-4 will-change-transform">
                  <div className="flex items-center gap-3 mb-2">
                    <Flame className="w-8 h-8 text-purple-400" />
                    <h3 className="text-xl font-bold text-white">PASSIONS & INTÉRÊTS</h3>
                  </div>
                  <p className="text-white">Identifiez vos domaines de prédilection, vos motivations profondes et vos aspirations professionnelles pour orienter votre parcours vers des domaines qui vous passionnent.</p>
                </div>

                <div className="cursor-pointer bg-white/10 hover:bg-white/15 hover:scale-[1.02] transition-all rounded-lg p-4 will-change-transform">
                  <div className="flex items-center gap-3 mb-2">
                    <GraduationCap className="w-8 h-8 text-blue-400" />
                    <h3 className="text-xl font-bold text-white">PROJET D'ÉTUDES</h3>
                  </div>
                  <p className="text-white">Définissez les aspects pratiques de votre formation : budget, durée, localisation et critères prioritaires pour choisir votre établissement idéal.</p>
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
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
    const createTempUser = async () => {
      if (isCreatingTempUser || sessionStorage.getItem('tempUser')) return;

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

    createTempUser();
  }, []);

  if (isCreatingTempUser) {
    return (
      <GradientBackground>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-2xl p-8 bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Création d'une session temporaire...</p>
            </div>
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
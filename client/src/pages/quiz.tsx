import { useQuiz } from "@/hooks/use-quiz";
import { QuestionCard } from "@/components/quiz/question-card";
import { GradientBackground } from "@/components/layout/gradient-background";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function Quiz() {
  const [isCreatingTempUser, setIsCreatingTempUser] = useState(false);
  const quizProps = useQuiz();

  useEffect(() => {
    const createTempUser = async () => {
      const existingUser = sessionStorage.getItem('tempUser');
      if (isCreatingTempUser || existingUser) {
        return;
      }

      setIsCreatingTempUser(true);
      try {
        // First attempt to validate existing session
        const sessionCheck = await fetch('/api/user', {
          credentials: 'include'
        });

        if (sessionCheck.ok) {
          const userData = await sessionCheck.json();
          if (userData?.id) {
            sessionStorage.setItem('tempUser', JSON.stringify(userData));
            return;
          }
        }

        // Create new temp user if needed
        const response = await fetch('/api/temp-user', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server response:', errorText);
          throw new Error(`Failed to create temporary user: ${response.status}`);
        }

        const data = await response.json();
        if (!data?.id) {
          throw new Error('Invalid server response: missing user ID');
        }

        // Store user data and reload
        sessionStorage.setItem('tempUser', JSON.stringify(data));
        window.location.reload();
      } catch (error) {
        console.error('Error creating temp user:', error);
      } finally {
        setIsCreatingTempUser(false);
      }
    };

    createTempUser();
  }, [isCreatingTempUser]);

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

  const { currentQuestion, handleAnswer, answers } = quizProps;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  if (!currentQuestion) {
    return (
      <GradientBackground>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-2xl p-8 bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Chargement du questionnaire...</p>
            </div>
          </Card>
        </div>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <div className="container mx-auto min-h-screen py-8">
        <QuestionCard 
          question={currentQuestion}
          onAnswer={handleAnswer}
          currentAnswer={currentAnswer}
        />
      </div>
    </GradientBackground>
  );
}
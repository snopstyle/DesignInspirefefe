import { useQuiz } from "@/hooks/use-quiz";
import { QuestionCard } from "@/components/quiz/question-card";
import { GradientBackground } from "@/components/layout/gradient-background";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Quiz() {
  const { currentQuestion, handleAnswer, answers } = useQuiz();
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
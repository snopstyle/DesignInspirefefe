import { useQuiz } from "@/hooks/use-quiz";
import { QuestionCard } from "@/components/quiz/question-card";
import { GradientBackground } from "@/components/layout/gradient-background";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Quiz() {
  const { currentQuestion, handleAnswer, answers } = useQuiz();
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  if (!currentQuestion) {
    setLocation('/');
    return null;
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
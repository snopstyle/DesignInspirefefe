import { useQuiz } from "@/hooks/use-quiz";
import { QuestionCard } from "@/components/quiz/question-card";
import { ProgressBar } from "@/components/quiz/progress-bar";
import { GradientBackground } from "@/components/layout/gradient-background";
import { Loader2 } from "lucide-react";
import { QUESTIONS } from "@/lib/quiz-logic";

export default function Quiz() {
  const { currentQuestion, answers, handleAnswer, isSubmitting } = useQuiz();

  if (isSubmitting) {
    return (
      <GradientBackground>
        <div className="container mx-auto min-h-screen flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <p className="text-white">Chargement de la session...</p>
        </div>
      </GradientBackground>
    );
  }

  // If we don't have a question (quiz completed), show nothing
  if (!currentQuestion) {
    return null;
  }

  return (
    <GradientBackground className="p-4">
      <div className="container mx-auto py-8">
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          currentAnswer={answers[currentQuestion.id]}
        />
      </div>
    </GradientBackground>
  );
}
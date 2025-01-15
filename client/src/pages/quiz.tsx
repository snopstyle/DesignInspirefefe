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
        <div className="container mx-auto min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      </GradientBackground>
    );
  }

  // Get the current question data
  const question = QUESTIONS[currentQuestion];

  // If we don't have a question (quiz completed), show nothing
  if (!question) {
    return null;
  }

  return (
    <GradientBackground className="p-4">
      <div className="container mx-auto py-8">
        <ProgressBar
          current={currentQuestion}
          total={Object.keys(QUESTIONS).length}
        />
        <QuestionCard
          question={question.text}
          options={question.options}
          onAnswer={handleAnswer}
          currentAnswer={answers[currentQuestion]}
        />
      </div>
    </GradientBackground>
  );
}
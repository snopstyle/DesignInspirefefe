import { useQuiz } from "@/hooks/use-quiz";
import { QuestionCard } from "@/components/quiz/question-card";
import { ProgressBar } from "@/components/quiz/progress-bar";
import { GradientBackground } from "@/components/layout/gradient-background";

// This would be loaded from the Excel file
const QUESTIONS = {
  1: {
    text: "How do you prefer to solve problems?",
    options: [
      "Analyze data and facts",
      "Trust your intuition",
      "Collaborate with others",
      "Try different approaches"
    ]
  }
  // Add more questions
};

export default function Quiz() {
  const { currentQuestion, answers, handleAnswer } = useQuiz();
  const question = QUESTIONS[currentQuestion as keyof typeof QUESTIONS];

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

import { useQuiz } from "@/hooks/use-quiz";
import { QuestionCard } from "@/components/quiz/question-card";
import { GradientBackground } from "@/components/layout/gradient-background";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useUser } from "@/hooks/use-user";
import { Card } from "@/components/ui/card";

export default function Quiz() {
  const { user, isLoading } = useUser();

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

  const { currentQuestion, answers, handleAnswer, isSubmitting } = useQuiz();

  if (isSubmitting) {
    return (
      <GradientBackground>
        <div className="container mx-auto min-h-screen flex flex-col items-center justify-center">
          <Card className="w-full max-w-2xl p-8 bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p>Chargement de la session...</p>
            </div>
          </Card>
        </div>
      </GradientBackground>
    );
  }

  // If we don't have a question (quiz completed), show nothing
  if (!currentQuestion) {
    return null;
  }

  return (
    <GradientBackground>
      <div className="container mx-auto min-h-screen py-8 flex items-center justify-center">
        <Card className="w-full max-w-2xl p-8 bg-background/80 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.3,
                ease: "easeInOut"
              }}
            >
              <QuestionCard
                question={currentQuestion}
                onAnswer={handleAnswer}
                currentAnswer={answers[currentQuestion.id]}
              />
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </GradientBackground>
  );
}
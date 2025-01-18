import { useState, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { getNextQuestion, calculateProfile, QUESTIONS } from "@/lib/quiz-logic";
import { useStartQuizSession, useUpdateQuizSession, useSubmitQuiz, useQuizSession } from "@/lib/quiz-logic";
import { queryClient } from "@/lib/queryClient";

export function useQuiz() {
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Get or create quiz session
  const { data: session } = useQuizSession();
  const startSession = useStartQuizSession();
  const updateSession = useUpdateQuizSession();
  const submitQuiz = useSubmitQuiz();

  // Start a new session if none exists
  useEffect(() => {
    if (!session) {
      startSession.mutate();
    }
  }, [session, startSession]);

  const handleAnswer = useCallback(async (answer: string | string[]) => {
    if (!session?.id) {
      toast({
        title: "Error",
        description: "No active quiz session",
        variant: "destructive",
      });
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answer,
    }));

    const nextQuestionId = getNextQuestion(currentQuestion);
    if (nextQuestionId) {
      // Update session with the answer
      try {
        await updateSession.mutateAsync({
          sessionId: session.id,
          questionId: `Q${currentQuestion}`,
          answer: Array.isArray(answer) ? answer[0] : answer,
          nextQuestionId: `Q${nextQuestionId}`,
        });
        setCurrentQuestion(nextQuestionId);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save answer",
          variant: "destructive",
        });
      }
    } else {
      // No more questions, submit the quiz
      try {
        await submitQuiz.mutateAsync(session.id);
        // Invalidate the session query after successful submission
        queryClient.invalidateQueries({ queryKey: ['/api/quiz/session/current'] });
        setLocation("/results");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to submit quiz",
          variant: "destructive",
        });
      }
    }
  }, [currentQuestion, session, updateSession, submitQuiz, toast, setLocation, queryClient]);

  // Find the current question object
  const currentQuestionObj = QUESTIONS.find(q => q.id === currentQuestion);

  return {
    currentQuestion: currentQuestionObj,
    answers,
    handleAnswer,
    isSubmitting: submitQuiz.isPending || updateSession.isPending,
  };
}
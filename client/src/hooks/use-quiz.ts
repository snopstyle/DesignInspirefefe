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
  const { data: session, isLoading: isLoadingSession } = useQuizSession();
  const startSession = useStartQuizSession();
  const updateSession = useUpdateQuizSession();
  const submitQuiz = useSubmitQuiz();

  // Start a new session if none exists
  useEffect(() => {
    const initSession = async () => {
      if (!session && !isLoadingSession && !startSession.isPending) {
        try {
          await startSession.mutateAsync();
          // Refetch the session after starting a new one
          queryClient.invalidateQueries({ queryKey: ['/api/quiz/session/current'] });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to start quiz session. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    initSession();
  }, [session, isLoadingSession, startSession, toast, queryClient]);

  const handleAnswer = useCallback(async (answer: string | string[]) => {
    if (!session?.id) {
      console.log('No session found, current session:', session);
      toast({
        title: "Error",
        description: "No active quiz session. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    try {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion]: answer,
      }));

      const nextQuestionId = getNextQuestion(currentQuestion, answer);
      if (nextQuestionId) {
        // Update session with the answer and next question based on adaptive path
        await updateSession.mutateAsync({
          sessionId: session.id,
          questionId: `Q${currentQuestion}`,
          answer: Array.isArray(answer) ? answer[0] : answer,
          nextQuestionId: `Q${nextQuestionId}`,
        });
        setCurrentQuestion(nextQuestionId);
      } else {
        // No more questions, submit the quiz
        await submitQuiz.mutateAsync(session.id);
        // Invalidate the session query after successful submission
        queryClient.invalidateQueries({ queryKey: ['/api/quiz/session/current'] });
        setLocation("/results");
      }
    } catch (error) {
      console.error('Error handling answer:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process answer",
        variant: "destructive",
      });
    }
  }, [currentQuestion, session, updateSession, submitQuiz, toast, setLocation, queryClient]);

  // Find the current question object
  const currentQuestionObj = QUESTIONS.find(q => q.id === currentQuestion);

  return {
    currentQuestion: currentQuestionObj,
    answers,
    handleAnswer,
    isSubmitting: submitQuiz.isPending || updateSession.isPending || isLoadingSession || startSession.isPending,
  };
}
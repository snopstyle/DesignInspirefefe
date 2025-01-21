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
      try {
        if (!session && !isLoadingSession && !startSession.isPending) {
          const newSession = await startSession.mutateAsync();
          if (newSession) {
            queryClient.invalidateQueries({ queryKey: ['/api/quiz/session/current'] });
          }
        }
      } catch (error) {
        toast({
          title: "Session Error",
          description: "Please make sure you are logged in and try again.",
          variant: "destructive",
        });
        setLocation("/auth");
      }
    };

    initSession();
  }, [session, isLoadingSession, startSession, toast, queryClient]);

  const handleAnswer = useCallback(async (answer: string | string[]) => {
    if (!session?.id) {
      console.log('Aucune session trouvée, session actuelle:', session);
      toast({
        title: "Erreur",
        description: "Aucune session de quiz active. Veuillez rafraîchir la page.",
        variant: "destructive",
      });
      return;
    }

    try {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion]: answer
      }));

      const nextQuestionId = getNextQuestion(currentQuestion);
      if (nextQuestionId) {
        // Update session with the answer
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
      console.error('Erreur lors du traitement de la réponse:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Échec du traitement de la réponse",
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
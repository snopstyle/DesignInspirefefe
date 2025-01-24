import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import quizData from '../lib/quiz-data.json';
import { useStartQuizSession, useUpdateQuizSession, useSubmitQuiz } from '../lib/quiz-logic';
import { useToast } from './use-toast';

export function useQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const startQuizSession = useStartQuizSession();
  const updateQuizSession = useUpdateQuizSession();
  const submitQuizMutation = useSubmitQuiz();

  const currentQuestion = quizData.questions[currentQuestionIndex];

  // Initialize quiz session if not already done
  const initializeSession = async () => {
    if (!sessionId) {
      try {
        const session = await startQuizSession.mutateAsync();
        setSessionId(session.id);
      } catch (error) {
        console.error('Failed to start quiz session:', error);
        toast({
          title: "Error",
          description: "Failed to start quiz. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleAnswer = async (answer: string) => {
    if (!sessionId) {
      await initializeSession();
    }

    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    try {
      const nextQuestionId = currentQuestionIndex < quizData.questions.length - 1 
        ? quizData.questions[currentQuestionIndex + 1].id.toString()
        : null;

      await updateQuizSession.mutateAsync({
        sessionId: sessionId!,
        questionId: currentQuestion.id.toString(),
        answer,
        nextQuestionId: nextQuestionId || ''
      });

      if (currentQuestionIndex < quizData.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Submit final results
        await submitQuizMutation.mutateAsync(sessionId!);
        sessionStorage.setItem('quizAnswers', JSON.stringify(newAnswers));
        setLocation('/results');
      }
    } catch (error) {
      console.error('Failed to save answer:', error);
      toast({
        title: "Error",
        description: "Failed to save your answer. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Initialize session on mount
  useEffect(() => {
    initializeSession();
  }, []); // Empty dependency array means this runs once on mount

  return {
    currentQuestion,
    handleAnswer,
    answers,
    isLoading: startQuizSession.isPending || updateQuizSession.isPending || submitQuizMutation.isPending
  };
}
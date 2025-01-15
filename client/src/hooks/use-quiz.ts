import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { determineNextQuestion, calculateProfile } from "@/lib/quiz-logic";

export function useQuiz() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const submitQuizMutation = useMutation({
    mutationFn: async (results: any) => {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(results),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      setLocation("/results");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnswer = useCallback((answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answer,
    }));

    const nextQuestion = determineNextQuestion(currentQuestion, answer);
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
    } else {
      const results = calculateProfile(answers);
      submitQuizMutation.mutate(results);
    }
  }, [currentQuestion, answers, submitQuizMutation]);

  return {
    currentQuestion,
    answers,
    handleAnswer,
    isSubmitting: submitQuizMutation.isPending,
  };
}


import { useState } from 'react';
import { useLocation } from 'wouter';
import quizData from '../lib/quiz-data.json';

export function useQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [, setLocation] = useLocation();

  const currentQuestion = quizData.questions[currentQuestionIndex];

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      sessionStorage.setItem('quizAnswers', JSON.stringify(newAnswers));
      setLocation('/results');
    }
  };

  return {
    currentQuestion,
    handleAnswer,
    answers,
  };
}

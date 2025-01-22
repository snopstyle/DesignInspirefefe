import { useState } from 'react';
import { useNavigate } from 'wouter';
import quizData from '../lib/quiz-data.json';

export function useQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const currentQuestion = quizData[currentQuestionIndex];

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Store answers in sessionStorage for results page
      sessionStorage.setItem('quizAnswers', JSON.stringify(newAnswers));
      navigate('/results');
    }
  };

  return {
    currentQuestion,
    handleAnswer,
    answers,
  };
}
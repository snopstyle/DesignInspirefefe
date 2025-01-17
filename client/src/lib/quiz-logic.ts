// Quiz sections and types based on QUIZ POOL.xlsx
import quizData from './quiz-data.json';
import { calculateProfileScores, getMatchedProfile } from './profile-logic';

export type QuestionFormat = "Single choice" | "Multiple choice" | "Scale" | "Text" | "Multiple selection" | "Drag-and-drop ranking" | "Slider";

export interface Question {
  id: number;
  section: string;
  text: string;
  options: string[];
  format: QuestionFormat;
}

// Helper function to parse slider options
export function parseSliderOptions(optionText: string) {
  try {
    // Example format: "Slider: €0–€20,000 (default: €5,000, step: €500)"
    const matches = optionText.match(/€(\d+(?:,\d+)?)[^€]*€(\d+(?:,\d+)?)[^€]*€(\d+(?:,\d+)?)[^€]*€(\d+(?:,\d+)?)/);
    if (!matches) return { min: 0, max: 20000, defaultValue: 5000, step: 500 };

    const [, min, max, defaultVal, step] = matches;
    return {
      min: parseInt(min.replace(/,/g, '')),
      max: parseInt(max.replace(/,/g, '')),
      defaultValue: parseInt(defaultVal.replace(/,/g, '')),
      step: parseInt(step.replace(/,/g, ''))
    };
  } catch (e) {
    console.error('Error parsing slider options:', e);
    return { min: 0, max: 20000, defaultValue: 5000, step: 500 };
  }
}

export interface QuizState {
  currentSection: string;
  currentQuestion: number;
  answers: Record<number, string | string[]>;
}

export interface Profile {
  psychoSocialProfile: Record<string, number>;
  dominantProfile: string;
  subProfile: string;
  traits: string[];
  educationProject: Record<string, string>;
}

// Questions are organized by sections as defined in QUIZ POOL.xlsx
export const QUIZ_SECTIONS = {
  PSYCHO_SOCIAL: "PSYCHO-SOCIAL PROFILE QUIZ",
  PASSION: "Passion & Interests",
  EDUCATION: "Education Project"
} as const;

// Load questions from the generated JSON
export const QUESTIONS = quizData.questions as Question[];

export function getCurrentSection(questionId: number): string {
  const question = QUESTIONS.find(q => q.id === questionId);
  return question?.section || "";
}

export function getNextQuestion(currentId: number): number | null {
  const currentIndex = QUESTIONS.findIndex(q => q.id === currentId);
  if (currentIndex === -1 || currentIndex === QUESTIONS.length - 1) {
    return null;
  }
  return QUESTIONS[currentIndex + 1].id;
}

// Debug function to help identify question loading issues
export function debugQuestionData(questionId: number) {
  const question = QUESTIONS.find(q => q.id === questionId);
  console.log('Question Data:', question);
  return question;
}

// Helper function to check if a question should use tag layout
export function shouldUseTagLayout(question: Question): boolean {
  return (
    (question.format === "Multiple choice" || question.format === "Multiple selection") &&
    question.options.length > 8
  );
}

export function calculateProfile(answers: Record<number, string | string[]>): Profile {
  // Convert numeric keys to string format for profile calculation
  const stringAnswers: Record<string, string> = {};
  Object.entries(answers).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // For multiple selection questions, join the array into a string
      stringAnswers[`Q${key}`] = value.join(', ');
    } else {
      stringAnswers[`Q${key}`] = value;
    }
  });

  // Calculate profile scores using imported functions
  const profileScores = calculateProfileScores(stringAnswers);
  const matchedProfile = getMatchedProfile(profileScores);

  return {
    psychoSocialProfile: profileScores,
    dominantProfile: matchedProfile,
    subProfile: matchedProfile,
    traits: Object.entries(profileScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([trait]) => trait),
    educationProject: {
      budget: stringAnswers['Q51'] || '0',
      duration: stringAnswers['Q52'] || '',
      locations: (answers[53] || []) as string[],
      mobility: stringAnswers['Q54'] || '',
      criteria: (answers[55] || []) as string[]
    }
  };
}
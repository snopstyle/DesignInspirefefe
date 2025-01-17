// Quiz sections and types based on QUIZ POOL.xlsx
import quizData from './quiz-data.json';

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
  passionInterests: string[];
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
    subProfile: getMatchedProfile(profileScores),
    traits: Object.entries(profileScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([trait]) => trait),
    educationProject: {}
  };
}
  };

  // Process answers for each section
  Object.entries(answers).forEach(([questionId, answer]) => {
    const question = QUESTIONS.find(q => q.id === parseInt(questionId));
    if (!question) return;

    switch (question.section) {
      case QUIZ_SECTIONS.PSYCHO_SOCIAL:
        // Map answers to psycho-social traits
        if (typeof answer === 'string') {
          const traits = mapAnswerToTraits(answer, question);
          traits.forEach(trait => {
            profile.psychoSocialProfile[trait] = (profile.psychoSocialProfile[trait] || 0) + 1;
          });
        }
        break;

      case QUIZ_SECTIONS.PASSION:
        // Add passion and interests
        if (Array.isArray(answer)) {
          profile.passionInterests.push(...answer);
        } else {
          profile.passionInterests.push(answer);
        }
        break;

      case QUIZ_SECTIONS.EDUCATION:
        // Map education project preferences
        if (typeof answer === 'string') {
          profile.educationProject[question.text] = answer;
        }
        break;
    }
  });

  return profile;
}

// Helper function to map answers to traits based on the question and answer
function mapAnswerToTraits(answer: string, question: Question): string[] {
  // This mapping should be based on the Excel file's trait categorization
  // For now, we'll use a simple mapping based on the answer text
  const traits: string[] = [];

  // Add traits based on the question context and answer
  if (answer.toLowerCase().includes('analytical') || answer.toLowerCase().includes('systematic')) {
    traits.push('Analytical');
  }
  if (answer.toLowerCase().includes('creative') || answer.toLowerCase().includes('innovative')) {
    traits.push('Creative');
  }
  if (answer.toLowerCase().includes('team') || answer.toLowerCase().includes('collaborate')) {
    traits.push('Collaborative');
  }
  if (answer.toLowerCase().includes('practical') || answer.toLowerCase().includes('hands-on')) {
    traits.push('Practical');
  }
  if (answer.toLowerCase().includes('lead') || answer.toLowerCase().includes('guide')) {
    traits.push('Leadership');
  }

  // If no specific traits were mapped, use the answer itself as a trait
  if (traits.length === 0) {
    traits.push(answer);
  }

  return traits;
}
// Implementing adaptive tree structure for the quiz
export interface Question {
  text: string;
  options: string[];
  weights: Record<string, number>; // trait weights for each option
  next: Record<string, number>; // next question based on answer
}

export interface QuizState {
  currentQuestion: number;
  answers: Record<string, string>;
}

export interface Profile {
  dominantProfile: string;
  subProfile: string;
  traits: string[];
  scores: Record<string, number>;
}

// Adaptive question tree based on Logic.py structure
export const QUESTIONS: Record<number, Question> = {
  1: {
    text: "How do you prefer to approach problem-solving?",
    options: [
      "Break it down systematically",
      "Trust intuition and experience",
      "Collaborate with others",
      "Try multiple approaches"
    ],
    weights: {
      "Analytical": 2,
      "Intuitive": 1,
      "Collaborative": 1.5,
      "Adaptable": 1
    },
    next: {
      "Break it down systematically": 2,
      "Trust intuition and experience": 3,
      "Collaborate with others": 4,
      "Try multiple approaches": 5
    }
  },
  2: {
    text: "When analyzing data, what's most important to you?",
    options: [
      "Accuracy and precision",
      "Finding patterns",
      "Practical applications",
      "Multiple perspectives"
    ],
    weights: {
      "Analytical": 2,
      "Pattern Recognition": 1.5,
      "Practical": 1,
      "Holistic": 1
    },
    next: {
      "Accuracy and precision": 6,
      "Finding patterns": 7,
      "Practical applications": 8,
      "Multiple perspectives": 9
    }
  },
  3: {
    text: "How do you prefer to learn new concepts?",
    options: [
      "Through detailed study",
      "By experimenting",
      "Through discussion",
      "By observing others"
    ],
    weights: {
      "Methodical": 2,
      "Experimental": 1.5,
      "Interactive": 1,
      "Observant": 1
    },
    next: {
      "Through detailed study": 6,
      "By experimenting": 7,
      "Through discussion": 8,
      "By observing others": 9
    }
  }
};

export function determineNextQuestion(currentQuestion: number, answer: string): number | null {
  const question = QUESTIONS[currentQuestion];
  if (!question) return null;

  // Get next question based on the answer
  const nextQuestion = question.next[answer];

  // If there's no specific next question or it doesn't exist, end the quiz
  if (!nextQuestion || !QUESTIONS[nextQuestion]) {
    return null;
  }

  return nextQuestion;
}

export function calculateProfile(answers: Record<string, string>): Profile {
  const traitScores: Record<string, number> = {};

  // Calculate trait scores based on answers and weights
  Object.entries(answers).forEach(([questionId, answer]) => {
    const question = QUESTIONS[parseInt(questionId)];
    if (!question) return;

    const weights = question.weights;
    Object.entries(weights).forEach(([trait, weight]) => {
      traitScores[trait] = (traitScores[trait] || 0) + weight;
    });
  });

  // Find dominant trait
  let dominantTrait = '';
  let maxScore = 0;
  Object.entries(traitScores).forEach(([trait, score]) => {
    if (score > maxScore) {
      maxScore = score;
      dominantTrait = trait;
    }
  });

  // Map trait to profile
  const profile: Profile = {
    dominantProfile: "Analytical Thinker",
    subProfile: "Researcher",
    traits: Object.entries(traitScores)
      .filter(([_, score]) => score > 0)
      .map(([trait]) => trait),
    scores: traitScores
  };

  // Determine profile based on dominant trait
  switch(dominantTrait) {
    case "Intuitive":
    case "Pattern Recognition":
      profile.dominantProfile = "Creative Innovator";
      profile.subProfile = "Pattern Seeker";
      break;
    case "Collaborative":
    case "Interactive":
      profile.dominantProfile = "Team Facilitator";
      profile.subProfile = "Group Catalyst";
      break;
    case "Adaptable":
    case "Experimental":
      profile.dominantProfile = "Adaptive Problem Solver";
      profile.subProfile = "Practical Innovator";
      break;
  }

  return profile;
}
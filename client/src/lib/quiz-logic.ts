// This would be replaced with actual logic from Logic.py and Excel file
export interface Question {
  text: string;
  options: string[];
}

export interface QuizState {
  currentQuestion: number;
  answers: Record<string, string>;
}

export interface Profile {
  dominantProfile: string;
  subProfile: string;
  traits: string[];
}

export const QUESTIONS: Record<number, Question> = {
  1: {
    text: "How do you prefer to solve problems?",
    options: [
      "Analyze data and facts",
      "Trust your intuition",
      "Collaborate with others",
      "Try different approaches"
    ]
  },
  2: {
    text: "When learning something new, what approach do you take?",
    options: [
      "Read documentation thoroughly",
      "Learn by doing and experimenting",
      "Watch tutorials and demonstrations",
      "Discuss with others who have experience"
    ]
  },
  3: {
    text: "How do you handle challenging situations?",
    options: [
      "Break it down into smaller parts",
      "Look for creative solutions",
      "Seek advice from others",
      "Trust your gut feeling"
    ]
  },
  4: {
    text: "What environment helps you work best?",
    options: [
      "Quiet and organized space",
      "Dynamic and flexible environment",
      "Collaborative workspace",
      "Anywhere that feels inspiring"
    ]
  }
};

export function determineNextQuestion(currentQuestion: number, _answer: string): number | null {
  const totalQuestions = Object.keys(QUESTIONS).length;
  const nextQuestion = currentQuestion + 1;

  return nextQuestion <= totalQuestions ? nextQuestion : null;
}

export function calculateProfile(answers: Record<string, string>): Profile {
  // Calculate dominant traits based on answers
  const traits = new Map<string, number>();

  // Map answers to traits
  Object.entries(answers).forEach(([question, answer]) => {
    switch(question) {
      case "1":
        if (answer === "Analyze data and facts") traits.set("Analytical", (traits.get("Analytical") || 0) + 1);
        if (answer === "Trust your intuition") traits.set("Intuitive", (traits.get("Intuitive") || 0) + 1);
        if (answer === "Collaborate with others") traits.set("Collaborative", (traits.get("Collaborative") || 0) + 1);
        break;
      case "2":
        if (answer === "Read documentation thoroughly") traits.set("Methodical", (traits.get("Methodical") || 0) + 1);
        if (answer === "Learn by doing and experimenting") traits.set("Practical", (traits.get("Practical") || 0) + 1);
        if (answer === "Watch tutorials and demonstrations") traits.set("Visual", (traits.get("Visual") || 0) + 1);
        break;
      case "3":
        if (answer === "Break it down into smaller parts") traits.set("Systematic", (traits.get("Systematic") || 0) + 1);
        if (answer === "Look for creative solutions") traits.set("Creative", (traits.get("Creative") || 0) + 1);
        if (answer === "Seek advice from others") traits.set("Collaborative", (traits.get("Collaborative") || 0) + 1);
        break;
      case "4":
        if (answer === "Quiet and organized space") traits.set("Focused", (traits.get("Focused") || 0) + 1);
        if (answer === "Dynamic and flexible environment") traits.set("Adaptable", (traits.get("Adaptable") || 0) + 1);
        if (answer === "Collaborative workspace") traits.set("Team-oriented", (traits.get("Team-oriented") || 0) + 1);
        break;
    }
  });

  // Get dominant trait
  let dominantTrait = "";
  let maxScore = 0;
  traits.forEach((score, trait) => {
    if (score > maxScore) {
      maxScore = score;
      dominantTrait = trait;
    }
  });

  // Map dominant trait to profile
  let profile: Profile = {
    dominantProfile: "Analytical Thinker",
    subProfile: "Researcher",
    traits: Array.from(traits.keys()).filter(trait => traits.get(trait)! > 0)
  };

  // Map dominant traits to profiles
  switch(dominantTrait) {
    case "Intuitive":
    case "Creative":
      profile = {
        dominantProfile: "Creative Innovator",
        subProfile: "Visionary",
        traits: Array.from(traits.keys()).filter(trait => traits.get(trait)! > 0)
      };
      break;
    case "Collaborative":
    case "Team-oriented":
      profile = {
        dominantProfile: "Team Player",
        subProfile: "Facilitator",
        traits: Array.from(traits.keys()).filter(trait => traits.get(trait)! > 0)
      };
      break;
    case "Practical":
    case "Adaptable":
      profile = {
        dominantProfile: "Pragmatic Adapter",
        subProfile: "Problem Solver",
        traits: Array.from(traits.keys()).filter(trait => traits.get(trait)! > 0)
      };
      break;
  }

  return profile;
}
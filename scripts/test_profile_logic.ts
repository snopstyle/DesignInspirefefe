import { calculateProfileScores, getMatchedProfile } from '../client/src/lib/profile-logic';

// Test data with French answers matching the current profile logic
const testAnswers = {
  "Q1": "Forte préférence pour le travail d'équipe",
  "Q2": "Raisonnement logique",
  "Q3": "Applications pratiques",
  "Q4": "Très importante",
  "Q5": "Préférence pour les risques",
  "Q6": "J'adore ça",
  "Q7": "Préférence pour les tâches techniques",
  "Q8": "Très bien",
  "Q9": "Très importante",
  "Q10": "J'adore ça",
  "Q11": "Très importante",
  "Q12": "J'adore ça",
  "Q13": "Très bien",
  "Q14": "Très passionné",
  "Q15": "J'adore ça"
};

console.log("Testing profile logic...\n");

// Test score calculation
const scores = calculateProfileScores(testAnswers);
console.log("Profile Scores:");
Object.entries(scores)
  .sort(([,a], [,b]) => (b as number) - (a as number))
  .slice(0, 10)
  .forEach(([trait, score]) => {
    console.log(`${trait}: ${(score as number).toFixed(2)}`);
  });

// Test profile matching
const matchedProfile = getMatchedProfile(scores);
console.log("\nMatched Profile:", matchedProfile);
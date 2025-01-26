import { type Question } from './quiz-logic';

// Catégories regroupées
export const categories: Record<string, string[]> = {
  "Analytique & Technique": [
    "Raisonnement Analytique",
    "Interprétation des Données", 
    "Expertise Technique",
    "Précision"
  ],
  "Stratégie & Planification": [
    "Planification Stratégique",
    "Évaluation des Risques",
    "Pensée à Long Terme"
  ],
  "Créativité & Innovation": [
    "Expression Créative",
    "Sensibilité Esthétique",
    "Innovation",
    "Adaptabilité"
  ],
  "Social & Humanitaire": [
    "Conscience Sociale",
    "Collaboration",
    "Empathie",
    "Perspective Globale"
  ],
  "Leadership & Exécution": [
    "Prise de Décision",
    "Organisation",
    "Exécution Stratégique",
    "Résolution de Problèmes"
  ],
  "Apprentissage & Croissance": [
    "Curiosité Intellectuelle",
    "État d'Esprit de Croissance",
    "Polyvalence",
    "Pensée Interdisciplinaire"
  ]
};

// Pondérations des questions étendues à Q32
export const question_weights: Record<string, Record<string, number>> = {
  "1": { "Social & Humanitaire": 0.4, "Leadership & Exécution": 0.3 },
  "2": { "Analytique & Technique": 0.5, "Créativité & Innovation": 0.3 },
  "3": { "Apprentissage & Croissance": 0.4, "Stratégie & Planification": 0.3 },
  "4": { "Social & Humanitaire": 0.6 },
  "5": { "Stratégie & Planification": 0.5, "Leadership & Exécution": 0.3 },
  "6": { "Analytique & Technique": 0.6 },
  "7": { "Créativité & Innovation": 0.7, "Analytique & Technique": 0.3 },
  "8": { "Leadership & Exécution": 0.5 },
  "9": { "Social & Humanitaire": 0.7 },
  "10": { "Apprentissage & Croissance": 0.5 },
  "11": { "Analytique & Technique": 0.6 },
  "12": { "Apprentissage & Croissance": 0.5 },
  "13": { "Leadership & Exécution": 0.6 },
  "14": { "Créativité & Innovation": 0.7 },
  "15": { "Apprentissage & Croissance": 0.4 },
  "16": { "Leadership & Exécution": 0.7 },
  "17": { "Créativité & Innovation": 0.6 },
  "18": { "Social & Humanitaire": 0.5 },
  "19": { "Leadership & Exécution": 0.6 },
  "20": { "Social & Humanitaire": 0.5 },
  "21": { "Analytique & Technique": 0.5 },
  "22": { "Apprentissage & Croissance": 0.6 },
  "23": { "Stratégie & Planification": 0.5 },
  "24": { "Apprentissage & Croissance": 0.5 },
  "25": { "Social & Humanitaire": 0.6 },
  "26": { "Créativité & Innovation": 0.4, "Apprentissage & Croissance": 0.3 },
  "27": {}, // Géré séparément
  "28": { "Social & Humanitaire": -0.5 },
  "29": { "Leadership & Exécution": 0.7 },
  "30": { "Stratégie & Planification": 0.5, "Apprentissage & Croissance": 0.3 },
  "31": { "Apprentissage & Croissance": 0.6 },
  "32": { "Leadership & Exécution": 0.8 }
};

// Configuration spéciale pour Q27 (classement)
const RANKING_WEIGHTS = [1.0, 0.7, 0.5, 0.3, 0.1];
const Q27_MAPPINGS: Record<string, string> = {
  "Mathématiques": "Analytique & Technique",
  "Physique-Chimie": "Analytique & Technique",
  "Biologie/Sciences de la Terre": "Apprentissage & Croissance",
  "Littérature/Philosophie": "Créativité & Innovation",
  "Histoire/Géographie": "Social & Humanitaire",
  "Économie/Sciences Sociales": "Social & Humanitaire", 
  "Langues Étrangères": "Apprentissage & Croissance",
  "Informatique": "Analytique & Technique",
  "Arts (Visuels, Musique, Théâtre)": "Créativité & Innovation",
  "Sciences de l'Ingénieur": "Stratégie & Planification"
};

// Fonction de calcul mise à jour
export function calculateProfileScores(userAnswers: Record<string, string | string[]>): Record<string, number> {
  const categoryScores = Object.keys(categories).reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {});

  Object.entries(userAnswers).forEach(([questionId, answer]) => {
    const qNum = questionId.replace('Q', '');

    // Traitement spécial pour Q27
    if (qNum === '27') {
      const rankedAnswers = answer as string[];
      rankedAnswers.forEach((option, index) => {
        const category = Q27_MAPPINGS[option];
        if (category) {
          const weight = RANKING_WEIGHTS[index] || 0;
          categoryScores[category] += weight;
        }
      });
      return;
    }

    // Traitement standard pour les autres questions
    if (!question_weights[qNum]) return;

    const value = answerValue(answer, `Q${qNum}`);
    Object.entries(question_weights[qNum]).forEach(([category, weight]) => {
      categoryScores[category] += weight * value;
    });
  });

  return categoryScores;
}

// Fonction answerValue étendue
export function answerValue(answer: string | string[], questionId: string): number {
  const defaultScale = {
    "Très important": 1.0,
    "Important": 0.75,
    "Neutre": 0.5,
    "Peu important": 0.25,
    "Pas important": 0.0,
  };

  // Gestion des questions multi-sélection
  if (Array.isArray(answer)) {
    return answer.length > 0 ? 1.0 : 0.0;
  }

  return defaultScale[answer as keyof typeof defaultScale] || 0.0;
}

// Mapping des profils
export const dominant_profile_mapping: Record<string, string> = {
  "Analytique & Technique": "Analytique & Technique",
  "Stratégie & Planification": "Pragmatique & Stratégique",
  "Créativité & Innovation": "Créatif & Expressif",
  "Social & Humanitaire": "Social & Humanitaire",
  "Leadership & Exécution": "Pragmatique & Stratégique",
  "Apprentissage & Croissance": "Adaptatif & Exploratoire"
};

export function getMatchedProfile(categoryScores: Record<string, number>): string {
  let maxScore = -1;
  let matchedCategory = "";

  Object.entries(categoryScores).forEach(([category, score]) => {
    if (score > maxScore) {
      maxScore = score;
      matchedCategory = category;
    }
  });

  return dominant_profile_mapping[matchedCategory] || "Non déterminé";
}

// Export pour les tests
export const __testing = {
  answerValue,
  calculateProfileScores,
  getMatchedProfile
};
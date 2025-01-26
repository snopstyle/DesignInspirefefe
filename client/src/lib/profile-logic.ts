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
      // Questions équilibrées - impact ajusté
      "1": { "Social & Humanitaire": 0.8, "Leadership & Exécution": 0.4 },
      "2": { "Analytique & Technique": 0.8, "Créativité & Innovation": 0.4 },
      "3": { "Apprentissage & Croissance": 0.8, "Stratégie & Planification": 0.4 },
      "4": { "Social & Humanitaire": 0.6, "Créativité & Innovation": 0.4 },
      "5": { "Stratégie & Planification": 0.8, "Leadership & Exécution": 0.4 },
      
      // Questions moyennes (0.5-0.7)
      "6": { "Analytique & Technique": 0.7 },
      "7": { "Créativité & Innovation": 0.7, "Analytique & Technique": 0.3 },
      "8": { "Leadership & Exécution": 0.7 },
      "9": { "Social & Humanitaire": 0.7 },
      "10": { "Apprentissage & Croissance": 0.7 },
      "11": { "Analytique & Technique": 0.6 },
      "12": { "Apprentissage & Croissance": 0.6 },
      "13": { "Leadership & Exécution": 0.6 },
      "14": { "Créativité & Innovation": 0.6 },
      "15": { "Apprentissage & Croissance": 0.6 },
      
      // Questions complémentaires (0.3-0.5)
      "16": { "Leadership & Exécution": 0.5 },
      "17": { "Créativité & Innovation": 0.5 },
      "18": { "Social & Humanitaire": 0.5 },
      "19": { "Leadership & Exécution": 0.5 },
      "20": { "Social & Humanitaire": 0.5 },
      "21": { "Analytique & Technique": 0.5 },
      "22": { "Apprentissage & Croissance": 0.5 },
      "23": { "Stratégie & Planification": 0.5 },
      "24": { "Apprentissage & Croissance": 0.5 },
      "25": { "Social & Humanitaire": 0.5 },
      "26": {}, // Géré par Q26_MAPPINGS
      "27": {}, // Géré par Q27_MAPPINGS
      "28": {}, // Géré par Q28_MAPPINGS
      "29": {},  // Géré par Q29_MAPPINGS
      "30": { "Stratégie & Planification": 0.5, "Apprentissage & Croissance": 0.3 },
      "31": { "Apprentissage & Croissance": 0.6 },
      "32": { "Leadership & Exécution": 0.8 }
};

const Q26_MAPPINGS: Record<string, { category: string; weight: number }[]> = {
  "Coder ou programmer": [
    { category: "Analytique & Technique", weight: 0.8 },
    { category: "Apprentissage & Croissance", weight: 0.3 }
  ],
  "Peindre, dessiner ou autres arts visuels": [
    { category: "Créativité & Innovation", weight: 0.8 }
  ],
  "Faire du sport ou des activités de plein air": [
    { category: "Apprentissage & Croissance", weight: 0.6 },
    { category: "Leadership & Exécution", weight: 0.3 }
  ],
  "Faire du bénévolat ou du service communautaire": [
    { category: "Social & Humanitaire", weight: 0.8 }
  ],
  "Lire des livres": [
    { category: "Apprentissage & Croissance", weight: 0.7 }
  ],
  "Bricoler avec des gadgets ou de l'électronique": [
    { category: "Analytique & Technique", weight: 0.7 },
    { category: "Créativité & Innovation", weight: 0.3 }
  ],
  "Voyager ou explorer de nouvelles cultures": [
    { category: "Social & Humanitaire", weight: 0.7 },
    { category: "Apprentissage & Croissance", weight: 0.4 }
  ]
};

// Configuration spéciale pour Q27 (classement)
const RANKING_WEIGHTS = [1.0, 0.8, 0.6, 0.4, 0.2];
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

const Q28_MAPPINGS: Record<string, string> = {
  "Travail social-ONG": "Social & Humanitaire",
  "Arts-Divertissement": "Créativité & Innovation",
  "Technologie-IT": "Analytique & Technique",
  "Environnement-Développement durable": "Apprentissage & Croissance",
  "Science-Recherche": "Analytique & Technique",
  "Éducation-Enseignement": "Social & Humanitaire"
};
    const Q29_MAPPINGS: Record<string, { category: string; weight: number }> = {
      "Structuré et organisé (ex: bureau d'entreprise, laboratoire)": { category: "Leadership & Exécution", weight: 0.8 },
      "Créatif et flexible (ex: studio de design, startup)": { category: "Créativité & Innovation", weight: 0.9 },
      "Extérieur ou pratique (ex: travail de terrain, construction)": { category: "Apprentissage & Croissance", weight: 0.7 },
      "Social et collaboratif (ex: ONG, éducation)": { category: "Social & Humanitaire", weight: 0.8 },
      "Indépendant et autonome (ex: freelance, recherche)": { category: "Stratégie & Planification", weight: 0.7 }
    };

    // Fonction principale de calcul des scores
    export function calculateProfileScores(userAnswers: Record<string, string | string[]>): Record<string, number> {
      const categoryScores = Object.keys(categories).reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {});

      Object.entries(userAnswers).forEach(([questionId, answer]) => {
        const qNum = questionId.replace('Q', '');

        // Traitement de Q26 (Hobbies)
        if (qNum === '26') {
          (answer as string[]).forEach(hobby => {
            const mappings = Q26_MAPPINGS[hobby];
            mappings?.forEach(({ category, weight }) => {
              categoryScores[category] += weight;
            });
          });
        }

        // Traitement de Q27 (Classement académique)
        else if (qNum === '27') {
          (answer as string[]).slice(0, 5).forEach((option, index) => {
            const category = Q27_MAPPINGS[option];
            if (category) {
              categoryScores[category] += RANKING_WEIGHTS[index] || 0;
            }
          });
        }

        // Traitement de Q28 (Industries exclues)
        else if (qNum === '28') {
          (answer as string[]).forEach(industry => {
            const category = Q28_MAPPINGS[industry];
            if (category) categoryScores[category] -= 0.5; // Pénalité de -0.5
          });
        }

        // Traitement de Q29 (Environnement de travail)
        else if (qNum === '29') {
          const selectedEnv = answer as string;
          const mapping = Q29_MAPPINGS[selectedEnv];
          if (mapping) categoryScores[mapping.category] += mapping.weight;
        }

        // Traitement des questions 1-25 (logique existante)
        else if (parseInt(qNum) <= 25) {
          const value = answerValue(answer, `Q${qNum}`);
          Object.entries(question_weights[qNum] || {}).forEach(([category, weight]) => {
            categoryScores[category] += weight * value;
          });
        }
      });

      return categoryScores;
    }

    // Fonction de conversion des réponses en valeurs numériques
    export function answerValue(answer: string | string[], questionId: string): number {
      const scale: Record<string, number> = {
        "Très important": 1.0, "Important": 0.75, "Neutre": 0.5, "Peu important": 0.25, "Pas important": 0.0,
        "J'adore ça": 1.0, "J'aime bien": 0.75, "Je n'aime pas": 0.25, "Je déteste": 0.0
      };

      if (Array.isArray(answer)) return answer.length > 0 ? 1.0 : 0.0; // Sélections multiples
      return scale[answer] || 0.0;
    }

    // Mapping des profils dominants
    export const dominant_profile_mapping: Record<string, string> = {
      "Analytique & Technique": "Analytique & Technique",
      "Stratégie & Planification": "Pragmatique & Stratégique",
      "Créativité & Innovation": "Créatif & Expressif",
      "Social & Humanitaire": "Social & Humanitaire",
      "Leadership & Exécution": "Pragmatique & Stratégique",
      "Apprentissage & Croissance": "Adaptatif & Exploratoire"
    };

    // Résumés des profils
    export const profile_summaries = {
      "Analytique & Technique": {
        description: "Profil orienté vers l'analyse et la résolution technique de problèmes",
        strengths: ["Analyse logique", "Résolution de problèmes", "Pensée méthodique"],
        careers: ["Ingénieur", "Analyste de données", "Chercheur"],
        education_paths: ["Écoles d'ingénieurs", "Cursus scientifiques", "Formations techniques spécialisées"],
        skills_to_develop: ["Programmation", "Analyse de données", "Méthodologie scientifique"]
      },
      // ... (autres profils)
    };

    // Détermination du profil dominant
    export function getMatchedProfile(categoryScores: Record<string, number>): string {
      let maxScore = -Infinity;
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
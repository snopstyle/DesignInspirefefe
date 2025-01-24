import { type Question } from './quiz-logic';

// Core data structures
const key_traits: Record<string, number> = {
  "Organisation": 0,
  "Efficacité": 0,
  "Planification Stratégique": 0,
  "Mentalité Orientée Résultats": 0,
  // Keep rest of traits, just prioritize Organisateur traits
  "Raisonnement Analytique": 0,
  "Curiosité Intellectuelle": 0,
  "Interprétation des Données": 0,
  "Expertise Technique": 0,
  "Précision": 0,
  "Évaluation des Risques": 0,
  "Expression Créative": 0,
  "Sensibilité Esthétique": 0,
  "Imagination": 0,
  "Focus sur la Durabilité": 0,
  "Innovation": 0,
  "Adaptabilité": 0,
  "Pensée à Long Terme": 0,
  "Compétences en Communication": 0,
  "Partage des Connaissances": 0,
  "Patience": 0,
  "Compassion": 0,
  "Perspective Globale": 0,
  "Collaboration": 0,
  "Leadership Stratégique": 0,
  "Prise de Décision": 0,
  "Vision": 0,
  "Large Éventail de Compétences": 0,
  "Pensée Interdisciplinaire": 0,
  "État d'Esprit de Croissance": 0
};

const sub_profiles: Record<string, string[]> = {
  "Organisateur": ["Organisation", "Efficacité", "Planification Stratégique", "Mentalité Orientée Résultats"],
  "Communicant": ["Compétences en Communication", "Collaboration", "Adaptabilité"],
  // Keep other profiles
  "Chercheur": ["Raisonnement Analytique", "Curiosité Intellectuelle", "Interprétation des Données"],
  "Ingénieur": ["Expertise Technique", "Précision", "Planification Stratégique"],
  "Stratège en Données": ["Évaluation des Risques", "Pensée à Long Terme", "Efficacité"],
  "Artiste": ["Expression Créative", "Sensibilité Esthétique", "Imagination"],
  "Innovateur": ["Focus sur la Durabilité", "Innovation", "Adaptabilité"],
  "Designer": ["Expression Créative", "Pensée Visuelle", "Résolution de Problèmes"],
  "Défenseur": ["Conscience Sociale", "Plaidoyer Engagé", "Diplomatie"],
  "Éducateur": ["Compétences en Communication", "Partage des Connaissances", "Patience"],
  "Humanitaire": ["Compassion", "Perspective Globale", "Collaboration"],
  "Entrepreneur": ["Leadership Stratégique", "Innovation", "Mentalité Orientée Résultats"],
  "Leader": ["Leadership Stratégique", "Prise de Décision", "Vision"],
  "Généraliste": ["Adaptabilité", "Large Éventail de Compétences", "Pensée Interdisciplinaire"],
  "Apprenant à Vie": ["Curiosité Intellectuelle", "État d'Esprit de Croissance", "Pensée Interdisciplinaire"]
};

const question_weights: Record<string, Record<string, number>> = {
  // Increase weights for organization-related answers in first questions
  "1": { "Organisation": 0.5, "Efficacité": 0.3 },
  "2": { "Planification Stratégique": 0.5, "Mentalité Orientée Résultats": 0.3 },
  "3": { "Organisation": 0.4, "Efficacité": 0.4 },
  "4": { "Compétences en Communication": 0.6, "Collaboration": 0.4 }, // Communication profile
  "5": { "Compétences en Communication": 0.5, "Adaptabilité": 0.3 }, // Communication profile
  "6": { "Compétences en Communication": 0.6, "Collaboration": 0.4 }, // Communication profile
  // Keep other weights with reduced values
  "7": { "Expression Créative": 0.3, "Adaptabilité": 0.2 },
  "8": { "Efficacité": 0.3, "Organisation": 0.2 },
  "9": { "Leadership Stratégique": 0.3, "Vision": 0.2 },
  "10": { "Perspective Globale": 0.3, "Pensée Interdisciplinaire": 0.2 },
  "11": { "Précision": 0.3, "Organisation": 0.2 },
  "12": { "Curiosité Intellectuelle": 0.3, "État d'Esprit de Croissance": 0.2 },
  "13": { "Leadership Stratégique": 0.3, "Prise de Décision": 0.2 },
  "14": { "Innovation": 0.3, "Focus sur la Durabilité": 0.2 },
  "15": { "Adaptabilité": 0.3, "Résolution de Problèmes": 0.2 },
  "16": { "Expertise Technique": 0.3, "Précision": 0.2 },
  "17": { "Expression Créative": 0.3, "Sensibilité Esthétique": 0.2 },
  "18": { "Diplomatie": 0.3, "Compétences en Communication": 0.2 },
  "19": { "Organisation": 0.3, "Efficacité": 0.2 },
  "20": { "Compétences en Communication": 0.3, "Leadership Stratégique": 0.2 },
  "21": { "Innovation": 0.3, "Expertise Technique": 0.2 },
  "22": { "Adaptabilité": 0.3, "Efficacité": 0.2 },
  "23": { "Vision": 0.3, "Planification Stratégique": 0.2 },
  "24": { "Large Éventail de Compétences": 0.3, "Adaptabilité": 0.2 },
  "25": { "Conscience Sociale": 0.3, "Perspective Globale": 0.2 }
};

const sub_profile_weights: Record<string, Record<string, number>> = {
  "Organisateur": {
    "Organisation": 0.4,
    "Efficacité": 0.3,
    "Planification Stratégique": 0.2,
    "Mentalité Orientée Résultats": 0.1
  },
  "Communicant": {
    "Compétences en Communication": 0.4,
    "Collaboration": 0.3,
    "Adaptabilité": 0.3
  },
  // Keep other profile weights
  "Chercheur": {
    "Raisonnement Analytique": 0.4,
    "Curiosité Intellectuelle": 0.3,
    "Interprétation des Données": 0.3
  },
  "Ingénieur": {
    "Expertise Technique": 0.4,
    "Précision": 0.3,
    "Planification Stratégique": 0.3
  },
  "Stratège en Données": {
    "Évaluation des Risques": 0.4,
    "Pensée à Long Terme": 0.3,
    "Efficacité": 0.3
  },
  "Artiste": {
    "Expression Créative": 0.4,
    "Sensibilité Esthétique": 0.3,
    "Imagination": 0.3
  },
  "Innovateur": {
    "Focus sur la Durabilité": 0.4,
    "Innovation": 0.3,
    "Adaptabilité": 0.3
  },
  "Designer": {
    "Approche Centrée sur l'Utilisateur": 0.4,
    "Pensée Visuelle": 0.3,
    "Résolution de Problèmes": 0.3
  },
  "Défenseur": {
    "Conscience Sociale": 0.4,
    "Plaidoyer Engagé": 0.3,
    "Diplomatie": 0.3
  },
  "Éducateur": {
    "Compétences en Communication": 0.4,
    "Partage des Connaissances": 0.3,
    "Patience": 0.3
  },
  "Humanitaire": {
    "Compassion": 0.4,
    "Perspective Globale": 0.3,
    "Collaboration": 0.3
  },
  "Entrepreneur": {
    "Exécution Stratégique": 0.4,
    "Prise de Risque": 0.3,
    "Ambition": 0.3
  },
  "Leader": {
    "Leadership Stratégique": 0.4,
    "Prise de Décision": 0.3,
    "Vision": 0.3
  },
  "Généraliste": {
    "Adaptabilité": 0.4,
    "Polyvalence": 0.3,
    "Large Éventail de Compétences": 0.3
  },
  "Apprenant à Vie": {
    "Curiosité Intellectuelle": 0.4,
    "État d'Esprit de Croissance": 0.3,
    "Pensée Interdisciplinaire": 0.3
  }
};

const dominant_profile_mapping: Record<string, string> = {
  "Chercheur": "Analytique & Technique",
  "Ingénieur": "Analytique & Technique",
  "Stratège en Données": "Analytique & Technique",
  "Artiste": "Créatif & Expressif",
  "Innovateur": "Créatif & Expressif",
  "Designer": "Créatif & Expressif",
  "Défenseur": "Social & Humanitaire",
  "Éducateur": "Social & Humanitaire",
  "Humanitaire": "Social & Humanitaire",
  "Entrepreneur": "Pragmatique & Stratégique",
  "Leader": "Pragmatique & Stratégique",
  "Organisateur": "Pragmatique & Stratégique",
  "Généraliste": "Adaptatif & Exploratoire",
  "Apprenant à Vie": "Adaptatif & Exploratoire",
  "Communicant": "Social & Interactif"
};

const profile_summaries: Record<string, {
  description: string;
  strengths: string[];
  careers: string[];
  education_paths: string[];
  skills_to_develop: string[];
}> = {
  "Analytique & Technique": {
    description: "Vous êtes un résolveur de problèmes naturel qui excelle grâce à la logique, aux données et à la précision.",
    strengths: ["Pensée critique", "Résolution de problèmes", "Attention aux détails"],
    careers: ["Scientifique", "Ingénieur", "Analyste de données", "Chercheur", "Universitaire"],
    education_paths: ["Intelligence logico-mathématique", "Système 2 de Daniel Kahneman"],
    skills_to_develop: ["Vue d'ensemble", "Expression émotionnelle"]
  },
  "Créatif & Expressif": {
    description: "Vous êtes un rêveur et un innovateur qui voit le monde à travers le prisme des possibilités.",
    strengths: ["Créativité", "Innovation", "Expression émotionnelle"],
    careers: ["Artiste", "Designer", "Écrivain", "Entrepreneur", "Innovateur"],
    education_paths: ["Pensée divergente (Guilford)", "Théorie du Flux (Csikszentmihalyi)"],
    skills_to_develop: ["Structure", "Planification pratique"]
  },
  "Social & Humanitaire": {
    description: "Vous êtes une personne compatissante et empathique, motivée par l'impact social.",
    strengths: ["Empathie", "Communication", "Justice sociale"],
    careers: ["Travailleur social", "Enseignant", "Conseiller", "Militant", "Humanitaire"],
    education_paths: ["Intelligence Émotionnelle (Goleman)", "Comportement Prosocial (Eisenberg)"],
    skills_to_develop: ["Fixer des limites", "Gestion de l'épuisement"]
  },
  "Pragmatique & Stratégique": {
    description: "Vous êtes axé sur les résultats, l'ambition et l'exécution stratégique.",
    strengths: ["Leadership", "Mentalité axée sur les résultats", "Pensée stratégique"],
    careers: ["Entrepreneur", "Manager", "Stratège", "Investisseur"],
    education_paths: ["Rôles Managériaux (Mintzberg)", "Théorie du Changement (Kotter)"],
    skills_to_develop: ["Équilibre travail-vie", "Collaboration émotionnelle"]
  },
  "Adaptatif & Exploratoire": {
    description: "Vous êtes un explorateur polyvalent, motivé par la curiosité et l'adaptabilité.",
    strengths: ["Adaptabilité", "Curiosité", "Polyvalence"],
    careers: ["Consultant", "Voyageur", "Généraliste", "Passionné de culture"],
    education_paths: ["Théorie Triarchique (Sternberg)", "État d'Esprit de Croissance (Dweck)"],
    skills_to_develop: ["Engagement à long terme", "Spécialisation"]
  },
  "Social & Interactif": {
    description: "Vous êtes une personne sociable et interactive, motivée par la collaboration et la communication.",
    strengths: ["Collaboration", "Communication", "Adaptabilité"],
    careers: ["Enseignant", "Journaliste", "Responsable des relations publiques", "Travailleur social"],
    education_paths: ["Communication non-violente", "Intelligence émotionnelle"],
    skills_to_develop: ["Gestion du temps", "Leadership"]
  }
};

function answerValue(answer: string, questionId: string): number {
  const answerScales: Record<string, Record<string, number>> = {
    "Q1": {
      "Forte préférence pour le travail d'équipe": 1.0,
      "Préférence pour le travail d'équipe": 0.75,
      "Neutre": 0.5,
      "Préférence pour l'indépendance": 0.25,
      "Forte préférence pour l'indépendance": 0.0
    },
    "Q2": {
      "Raisonnement logique": 1.0,
      "Solutions créatives": 0.75,
      "Un mélange des deux": 0.5,
      "J'évite les problèmes": 0.0
    },
    "Q3": {
      "Idées abstraites": 1.0,
      "Applications pratiques": 0.75,
      "Les deux également": 0.5,
      "Ni l'un ni l'autre": 0.0
    },
    "Q4": {
      "Très importante": 1.0,
      "Importante": 0.75,
      "Neutre": 0.5,
      "Peu importante": 0.25,
      "Pas du tout importante": 0.0
    },
    "Q5": {
      "Forte préférence pour les risques": 1.0,
      "Préférence pour les risques": 0.75,
      "Neutre": 0.5,
      "Préférence pour la prudence": 0.25,
      "Forte préférence pour la prudence": 0.0
    },
    "Q6": {
      "J'adore ça": 1.0,
      "J'aime bien": 0.75,
      "Neutre": 0.5,
      "Je n'aime pas": 0.25,
      "Je déteste": 0.0
    },
    "Q7": {
      "Forte préférence pour les tâches créatives": 1.0,
      "Préférence pour les tâches créatives": 0.75,
      "Neutre": 0.5,
      "Préférence pour les tâches techniques": 0.25,
      "Forte préférence pour les tâches techniques": 0.0
    }
  };

  // Add default scale for remaining questions
  for (let i = 8; i <= 25; i++) {
    answerScales[`Q${i}`] = {
      "Très important": 1.0,
      "Important": 0.75,
      "Neutre": 0.5,
      "Peu important": 0.25,
      "Pas important": 0.0
    };
  }

  const scale = answerScales[questionId] || {};
  return scale[answer] || 0.0;
}

function calculateProfileScores(userAnswers: Record<string, string>): Record<string, number> {
  const profileScores: Record<string, number> = { ...key_traits };

  for (const [questionId, answer] of Object.entries(userAnswers)) {
    const qId = questionId.replace('Q', '');
    if (!question_weights[qId]) continue;

    const value = answerValue(answer, questionId);
    for (const [trait, weight] of Object.entries(question_weights[qId])) {
      if (trait in profileScores) {
        profileScores[trait] = (profileScores[trait] || 0) + (weight * value);
      }
    }
  }

  const maxScorePerTrait: Record<string, number> = {};
  for (const weights of Object.values(question_weights)) {
    for (const [trait, weight] of Object.entries(weights)) {
      maxScorePerTrait[trait] = (maxScorePerTrait[trait] || 0) + weight;
    }
  }

  for (const trait in profileScores) {
    if (maxScorePerTrait[trait] && maxScorePerTrait[trait] > 0) {
      profileScores[trait] = profileScores[trait] / maxScorePerTrait[trait];
    }
  }

  return profileScores;
}

function getMatchedProfile(profileScores: Record<string, number>): string {
  let maxScore = -1;
  let matchedProfile = "";

  for (const [profile, traits] of Object.entries(sub_profiles)) {
    let score = 0;
    let totalWeight = 0;

    for (const trait of traits) {
      if (trait in profileScores && profile in sub_profile_weights) {
        const weight = sub_profile_weights[profile][trait] || 0;
        score += profileScores[trait] * weight;
        totalWeight += weight;
      }
    }

    score = totalWeight > 0 ? (score / totalWeight) * 100 : 0;

    if (score > maxScore) {
      maxScore = score;
      matchedProfile = profile;
    }
  }

  return matchedProfile;
}

// Single export statement for all shared items
export {
  key_traits,
  sub_profiles,
  question_weights,
  sub_profile_weights,
  dominant_profile_mapping,
  profile_summaries,
  answerValue,
  calculateProfileScores,
  getMatchedProfile
};
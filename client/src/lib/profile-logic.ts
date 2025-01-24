import { type Question } from './quiz-logic';

// Core data structures
export const key_traits: Record<string, number> = {
  "Raisonnement Analytique": 0,
  "Curiosité Intellectuelle": 0,
  "Interprétation des Données": 0,
  "Expertise Technique": 0,
  "Précision": 0,
  "Planification Stratégique": 0,
  "Évaluation des Risques": 0,
  "Pensée à Long Terme": 0,
  "Efficacité": 0,
  "Expression Créative": 0,
  "Sensibilité Esthétique": 0,
  "Imagination": 0,
  "Focus sur la Durabilité": 0,
  "Innovation": 0,
  "Adaptabilité": 0,
  "Approche Centrée sur l'Utilisateur": 0,
  "Pensée Visuelle": 0,
  "Résolution de Problèmes": 0,
  "Conscience Sociale": 0,
  "Plaidoyer Engagé": 0,
  "Diplomatie": 0,
  "Compétences en Communication": 0,
  "Partage des Connaissances": 0,
  "Patience": 0,
  "Compassion": 0,
  "Perspective Globale": 0,
  "Collaboration": 0,
  "Exécution Stratégique": 0,
  "Prise de Risque": 0,
  "Ambition": 0,
  "Leadership Stratégique": 0,
  "Prise de Décision": 0,
  "Vision": 0,
  "Organisation": 0,
  "Mentalité Orientée Résultats": 0,
  "Polyvalence": 0,
  "Large Éventail de Compétences": 0,
  "Pensée Interdisciplinaire": 0,
  "État d'Esprit de Croissance": 0
};

export const sub_profiles: Record<string, string[]> = {
  "Chercheur": ["Raisonnement Analytique", "Curiosité Intellectuelle", "Interprétation des Données"],
  "Ingénieur": ["Expertise Technique", "Précision", "Planification Stratégique"],
  "Stratège en Données": ["Évaluation des Risques", "Pensée à Long Terme", "Efficacité"],
  "Artiste": ["Expression Créative", "Sensibilité Esthétique", "Imagination"],
  "Innovateur": ["Focus sur la Durabilité", "Innovation", "Adaptabilité"],
  "Designer": ["Approche Centrée sur l'Utilisateur", "Pensée Visuelle", "Résolution de Problèmes"],
  "Défenseur": ["Conscience Sociale", "Plaidoyer Engagé", "Diplomatie"],
  "Éducateur": ["Compétences en Communication", "Partage des Connaissances", "Patience"],
  "Humanitaire": ["Compassion", "Perspective Globale", "Collaboration"],
  "Entrepreneur": ["Exécution Stratégique", "Prise de Risque", "Ambition"],
  "Leader": ["Leadership Stratégique", "Prise de Décision", "Vision"],
  "Organisateur": ["Organisation", "Efficacité", "Mentalité Orientée Résultats"],
  "Généraliste": ["Adaptabilité", "Polyvalence", "Large Éventail de Compétences"],
  "Apprenant à Vie": ["Curiosité Intellectuelle", "État d'Esprit de Croissance", "Pensée Interdisciplinaire"]
};

export const question_weights: Record<string, Record<string, number>> = {
  "1": { "Collaboration": 0.4, "Adaptabilité": 0.3 },
  "2": { "Raisonnement Analytique": 0.5, "Expression Créative": 0.3 },
  "3": { "Pensée Interdisciplinaire": 0.4, "Pensée à Long Terme": 0.3 },
  "4": { "Conscience Sociale": 0.6, "État d'Esprit de Croissance": 0.2 },
  "5": { "Évaluation des Risques": 0.5, "Prise de Risque": 0.3 },
  "6": { "Interprétation des Données": 0.6, "Précision": 0.2 },
  "7": { "Expression Créative": 0.7, "Expertise Technique": 0.3 },
  "8": { "Efficacité": 0.5, "Organisation": 0.3 },
  "9": { "Plaidoyer Engagé": 0.7, "Leadership Stratégique": 0.2 },
  "10": { "Perspective Globale": 0.5, "Pensée Interdisciplinaire": 0.3 },
  "11": { "Précision": 0.6, "Organisation": 0.2 },
  "12": { "Curiosité Intellectuelle": 0.5, "État d'Esprit de Croissance": 0.3 },
  "13": { "Leadership Stratégique": 0.6, "Prise de Décision": 0.2 },
  "14": { "Focus sur la Durabilité": 0.7, "Innovation": 0.2 },
  "15": { "Adaptabilité": 0.4, "Résolution de Problèmes": 0.3 },
  "16": { "Expertise Technique": 0.7, "Résolution de Problèmes": 0.2 },
  "17": { "Sensibilité Esthétique": 0.6, "Expression Créative": 0.2 },
  "18": { "Diplomatie": 0.5, "Compétences en Communication": 0.3 },
  "19": { "Exécution Stratégique": 0.6, "Organisation": 0.2 },
  "20": { "Compétences en Communication": 0.5, "Leadership Stratégique": 0.3 },
  "21": { "Expertise Technique": 0.5, "Innovation": 0.3 },
  "22": { "Adaptabilité": 0.6, "Polyvalence": 0.2 },
  "23": { "Pensée à Long Terme": 0.5, "Vision": 0.3 },
  "24": { "Polyvalence": 0.5, "Large Éventail de Compétences": 0.3 },
  "25": { "Plaidoyer Engagé": 0.6, "Conscience Sociale": 0.2 }
};

export const dominant_profile_mapping: Record<string, string> = {
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
  "Apprenant à Vie": "Adaptatif & Exploratoire"
};

export const sub_profile_weights: Record<string, Record<string, number>> = {
  "Chercheur": {
    "Curiosité Intellectuelle": 0.30,
    "Précision": 0.25,
    "État d'Esprit de Croissance": 0.20,
    "Pensée Interdisciplinaire": 0.15
  },
  "Ingénieur": {
    "Compétences Techniques": 0.35,
    "Résolution de Problèmes": 0.30,
    "Mentalité Orientée Résultats": 0.20,
    "Précision": 0.15
  },
  "Stratège en Données": {
    "Pensée Analytique": 0.30,
    "Évaluation des Risques": 0.25,
    "Perspective à Long Terme": 0.25,
    "Efficacité": 0.20
  },
  "Artiste": {
    "Créativité": 0.40,
    "Intelligence Émotionnelle": 0.25,
    "Expression de Soi": 0.15,
    "Sensibilité Esthétique": 0.10
  },
  "Innovateur": {
    "Créativité": 0.40,
    "Expertise Technique": 0.25,
    "Mentalité Tournée vers l'Avenir": 0.15,
    "Prise de Risque": 0.10
  },
  "Designer": {
    "Créativité": 0.40,
    "Souci du Détail": 0.25,
    "Approche Centrée sur l'Utilisateur": 0.15,
    "Pensée Visuelle": 0.10
  },
  "Défenseur": {
    "Empathie": 0.40,
    "Détermination": 0.25,
    "Compétences en Communication": 0.15,
    "Plaidoyer": 0.10
  },
  "Éducateur": {
    "Patience": 0.40,
    "Compétences en Communication": 0.25,
    "Partage des Connaissances": 0.15,
    "Mentorat": 0.10
  },
  "Humanitaire": {
    "Compassion": 0.40,
    "Résilience": 0.25,
    "Perspective Globale": 0.15,
    "Résolution de Problèmes": 0.10
  },
  "Entrepreneur": {
    "Leadership": 0.35,
    "Créativité": 0.25,
    "Mentalité Orientée Résultats": 0.20,
    "Ambition": 0.10
  },
  "Leader": {
    "Prise de Décision": 0.35,
    "Communication": 0.25,
    "Vision pour l'Avenir": 0.20,
    "Pensée Stratégique": 0.10
  },
  "Organisateur": {
    "Organisation": 0.35,
    "Efficacité": 0.25,
    "Planification Stratégique": 0.30,
    "Mentalité Orientée Résultats": 0.10
  },
  "Généraliste": {
    "Adaptabilité": 0.35,
    "Curiosité": 0.25,
    "Large Éventail de Compétences": 0.20,
    "Ensemble de Compétences Étendues": 0.10
  },
  "Apprenant à Vie": {
    "Curiosité": 0.35,
    "Adaptabilité": 0.25,
    "État d'Esprit de Croissance": 0.20,
    "Auto-Amélioration": 0.10
  }
};

export const profile_summaries: Record<string, {
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
  }
};

// Helper functions
export function answerValue(answer: string, questionId: string): number {
    // Default 5-point scale for most questions
    const defaultScale = {
        "Très important": 1.0,
        "Important": 0.75,
        "Neutre": 0.5,
        "Peu important": 0.25,
        "Pas important": 0.0,
        "J'adore ça": 1.0,
        "J'aime bien": 0.75,
        "Neutre": 0.5,
        "Je n'aime pas": 0.25,
        "Je déteste": 0.0,
        "Très bien": 1.0,
        "Bien": 0.75,
        "Neutre": 0.5,
        "Mal": 0.25,
        "Très mal": 0.0
    };

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
        },
        "Q8": {
            "Très bien": 1.0,
            "Bien": 0.75,
            "Neutre": 0.5,
            "Mal": 0.25,
            "Très mal": 0.0
        },
        "Q9": {
            "Très importante": 1.0,
            "Importante": 0.75,
            "Neutre": 0.5,
            "Peu importante": 0.25,
            "Pas du tout importante": 0.0
        },
        "Q10": {
            "J'adore ça": 1.0,
            "J'aime bien": 0.75,
            "Neutre": 0.5,
            "Je n'aime pas": 0.25,
            "Je déteste": 0.0
        },
        "Q11": {
            "Très précis": 1.0,
            "Précis": 0.75,
            "Neutre": 0.5,
            "Imprécis": 0.25,
            "Très imprécis": 0.0
        },
        "Q12": {
            "Très curieux": 1.0,
            "Curieux": 0.75,
            "Neutre": 0.5,
            "Peu curieux": 0.25,
            "Pas curieux du tout": 0.0
        },
        "Q13": {
            "Excellent leader": 1.0,
            "Bon leader": 0.75,
            "Neutre": 0.5,
            "Mauvais leader": 0.25,
            "Horrible leader": 0.0
        },
        "Q14": {
            "Très important": 1.0,
            "Important": 0.75,
            "Neutre": 0.5,
            "Peu important": 0.25,
            "Pas du tout important": 0.0
        },
        "Q15": {
            "Très résilient": 1.0,
            "Résilient": 0.75,
            "Neutre": 0.5,
            "Peu résilient": 0.25,
            "Pas du tout résilient": 0.0
        },
        "Q16": {
            "Très important": 1.0,
            "Important": 0.75,
            "Neutre": 0.5,
            "Peu important": 0.25,
            "Pas du tout important": 0.0
        },
        "Q17": {
            "Très sensible": 1.0,
            "Sensible": 0.75,
            "Neutre": 0.5,
            "Peu sensible": 0.25,
            "Pas du tout sensible": 0.0
        },
        "Q18": {
            "Très diplomate": 1.0,
            "Diplomate": 0.75,
            "Neutre": 0.5,
            "Peu diplomate": 0.25,
            "Pas du tout diplomate": 0.0
        },
        "Q19": {
            "Très efficace": 1.0,
            "Efficace": 0.75,
            "Neutre": 0.5,
            "Peu efficace": 0.25,
            "Pas du tout efficace": 0.0
        },
        "Q20": {
            "Excellent communicateur": 1.0,
            "Bon communicateur": 0.75,
            "Neutre": 0.5,
            "Mauvais communicateur": 0.25,
            "Horrible communicateur": 0.0
        },
        "Q21": {
            "Très compétent": 1.0,
            "Compétent": 0.75,
            "Neutre": 0.5,
            "Peu compétent": 0.25,
            "Incompétent": 0.0
        },
        "Q22": {
            "Très adaptable": 1.0,
            "Adaptable": 0.75,
            "Neutre": 0.5,
            "Peu adaptable": 0.25,
            "Pas du tout adaptable": 0.0
        },
        "Q23": {
            "Très visionnaire": 1.0,
            "Visionnaire": 0.75,
            "Neutre": 0.5,
            "Peu visionnaire": 0.25,
            "Pas du tout visionnaire": 0.0
        },
        "Q24": {
            "Très polyvalent": 1.0,
            "Polyvalent": 0.75,
            "Neutre": 0.5,
            "Peu polyvalent": 0.25,
            "Pas du tout polyvalent": 0.0
        },
        "Q25": {
            "Très engagé": 1.0,
            "Engagé": 0.75,
            "Neutre": 0.5,
            "Peu engagé": 0.25,
            "Pas du tout engagé": 0.0
        }
    };

    const scale = answerScales[questionId] || {};
    return scale[answer] || 0.0;
}

export function calculateProfileScores(userAnswers: Record<string, string>): Record<string, number> {
    const profileScores: Record<string, number> = { ...key_traits };
    
    console.log('Calculating scores for answers:', userAnswers);

    for (const [questionId, answer] of Object.entries(userAnswers)) {
        // Only process questions 1-25 for trait calculation
        const qNum = questionId.toString();
        if (parseInt(qNum) > 25 || !question_weights[qNum]) {
            continue;
        }

        const value = answerValue(answer, qNum);
        console.log(`Question ${qNum} answer "${answer}" has value ${value}`);

        for (const [trait, weight] of Object.entries(question_weights[qNum])) {
            if (!(trait in profileScores)) {
                console.warn(`Unknown trait "${trait}" in question ${qNum}`);
                continue;
            }
            const score = weight * value;
            profileScores[trait] = (profileScores[trait] || 0) + score;
            console.log(`Adding score ${score} to trait ${trait} (weight: ${weight})`);
        }
    }

    console.log('Final profile scores:', profileScores);
    return profileScores;
}

export function getMatchedProfile(profileScores: Record<string, number>): string {
    let maxScore = -1;
    let matchedProfile = "";
    console.log('Matching profile for scores:', profileScores);

    for (const [profile, traits] of Object.entries(sub_profiles)) {
        let score = 0;
        let validTraits = 0;

        for (const trait of traits) {
            if (!(trait in profileScores)) {
                console.warn(`Missing trait "${trait}" for profile "${profile}"`);
                continue;
            }

            if (!(profile in sub_profile_weights)) {
                console.warn(`Missing weights for profile "${profile}"`);
                continue;
            }

            const weight = sub_profile_weights[profile][trait] || 0;
            const traitScore = profileScores[trait] * weight;
            score += traitScore;
            validTraits++;

            console.log(`Profile ${profile} - Trait ${trait}: score=${traitScore} (value=${profileScores[trait]} * weight=${weight})`);
        }

        // Normalize score based on valid traits
        if (validTraits > 0) {
            score = score / validTraits;
        }

        console.log(`Profile ${profile} total score: ${score}`);

        if (score > maxScore) {
            maxScore = score;
            matchedProfile = profile;
        }
    }

    console.log('Best matching profile:', matchedProfile, 'with score:', maxScore);
    return matchedProfile;
}

// Export for testing and debugging
export const __testing = {
    answerValue,
    calculateProfileScores,
    getMatchedProfile
};
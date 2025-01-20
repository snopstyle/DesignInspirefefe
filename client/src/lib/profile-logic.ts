import { type Question } from './quiz-logic';

// Core data structures
export const key_traits: Record<string, number> = {
    "Travail d'équipe": 0,
    "Indépendance": 0,
    "Raisonnement logique": 0,
    "Compétences analytiques": 0,
    "Créativité": 0,
    "Résolution de problèmes": 0,
    "Pensée abstraite": 0,
    "Pragmatisme": 0,
    "Innovation": 0,
    "Orientation résultats": 0,
    "Intelligence émotionnelle": 0,
    "Expression personnelle": 0,
    "Empathie": 0,
    "Compassion": 0,
    "Prise de risque": 0,
    "Prudence": 0,
    "Évaluation des risques": 0,
    "Planification stratégique": 0,
    "Amour des chiffres": 0,
    "Interprétation des données": 0,
    "Pensée analytique": 0,
    "Reconnaissance des modèles": 0,
    "Amour de l'apprentissage": 0,
    "Curiosité intellectuelle": 0,
    "Esprit de croissance": 0,
    "Développement personnel": 0,
    "Attention aux détails": 0,
    "Précision": 0,
    "Mentalité axée sur les résultats": 0,
    "Leadership": 0,
    "Prise de décision": 0,
    "Pensée stratégique": 0,
    "Vision d'avenir": 0,
    "Passion pour la durabilité": 0,
    "Plaidoyer": 0,
    "Perspective globale": 0,
    "Condition physique": 0,
    "Amour de la nature": 0,
    "Résilience": 0,
    "Résolution pratique de problèmes": 0,
    "Compétences techniques": 0,
    "Imagination": 0,
    "Sensibilité esthétique": 0,
    "Résolution de conflits": 0,
    "Diplomatie": 0,
    "Compétences en communication": 0,
    "Organisation": 0,
    "Efficacité": 0,
    "Planification à long terme": 0,
    "Confiance": 0,
    "Charisme": 0,
    "Expression émotionnelle": 0,
    "Expertise technique": 0,
    "Esprit tourné vers l'avenir": 0,
    "Adaptabilité": 0,
    "Réflexion à long terme": 0,
    "Ambition": 0,
    "Multitâche": 0,
    "Désir d'aider les autres": 0
};

export const sub_profiles: Record<string, string[]> = {
    "Le Chercheur": ["Curiosité intellectuelle", "Attention aux détails", "Amour de l'apprentissage", "Pensée abstraite", "Patience"],
    "Le Solutionneur": ["Raisonnement logique", "Compétences analytiques", "Orientation résultats", "Pragmatisme", "Pensée critique"],
    "L'Analyste de Données": ["Pensée analytique", "Attention aux détails", "Affinité pour les chiffres", "Reconnaissance des modèles", "Interprétation des données"],
    "Le Théoricien": ["Pensée profonde", "Créativité conceptuelle", "Rigueur intellectuelle", "Raisonnement abstrait", "Curiosité"],
    "L'Ingénieur": ["Compétences techniques", "Résolution de problèmes", "Orientation résultats", "Précision", "Innovation"],
    "L'Artiste": ["Créativité", "Intelligence émotionnelle", "Expression personnelle", "Imagination", "Sensibilité esthétique"],
    "L'Innovateur": ["Créativité", "Expertise technique", "Vision d'avenir", "Prise de risque", "Curiosité"],
    "Le Narrateur": ["Créativité", "Communication", "Intelligence émotionnelle", "Construction narrative", "Empathie"],
    "L'Interprète": ["Charisme", "Expression émotionnelle", "Présence scénique", "Confiance", "Adaptabilité"],
    "Le Designer": ["Créativité", "Attention aux détails", "Approche centrée utilisateur", "Pensée visuelle", "Résolution de problèmes"],
    "L'Aidant": ["Empathie", "Patience", "Désir d'aider les autres", "Collaboration", "Intelligence émotionnelle"],
    "L'Activiste": ["Passion", "Détermination", "Communication forte", "Plaidoyer", "Résilience"],
    "Le Communicant": ["Compétences interpersonnelles", "Empathie", "Adaptabilité", "Facilitation du dialogue", "Construction de relations"],
    "L'Éducateur": ["Patience", "Communication", "Amour de l'apprentissage", "Partage des connaissances", "Mentorat"],
    "L'Humanitaire": ["Compassion", "Résilience", "Perspective globale", "Résolution de problèmes", "Plaidoyer"],
    "L'Entrepreneur": ["Leadership", "Créativité", "Orientation résultats", "Prise de risque", "Ambition"],
    "Le Leader": ["Prise de décision", "Communication", "Vision d'avenir", "Pensée stratégique", "Confiance"],
    "Le Stratège": ["Pensée analytique", "Organisation", "Orientation résultats", "Efficacité", "Pensée à long terme"],
    "Le Commercial": ["Charisme", "Persévérance", "Orientation client", "Négociation", "Adaptabilité"],
    "L'Investisseur": ["Pensée analytique", "Évaluation des risques", "Vision à long terme", "Acuité financière", "Planification stratégique"],
    "Le Généraliste": ["Adaptabilité", "Curiosité", "Amour de l'apprentissage", "Polyvalence", "Large éventail de compétences"],
    "L'Intégrateur": ["Polyvalence", "Créativité", "Résolution de problèmes", "Pensée interdisciplinaire", "Adaptabilité"],
    "L'Apprenant Perpétuel": ["Curiosité", "Adaptabilité", "Mentalité de croissance", "Amour de l'apprentissage", "Développement personnel"],
    "Le Multipotentiel": ["Polyvalence", "Créativité", "Large éventail de compétences", "Adaptabilité", "Curiosité"],
    "L'Enthousiaste Culturel": ["Ouverture d'esprit", "Communication", "Perspective globale", "Curiosité", "Adaptabilité"],
    "Le Codeur": ["Compétences techniques", "Résolution de problèmes", "Passion pour le code", "Pensée logique", "Innovation"],
    "Le Passionné de Technologie": ["Compétences techniques", "Créativité", "Passion pour le bricolage", "Résolution pratique", "Curiosité"],
    "Le Créateur Numérique": ["Créativité", "Compétences techniques", "Approche centrée utilisateur", "Innovation", "Adaptabilité"],
    "Le Conservateur": ["Passion pour la nature", "Résolution de problèmes", "Perspective globale", "Plaidoyer", "Résilience"],
    "L'Aventurier": ["Condition physique", "Adaptabilité", "Amour de la nature", "Résolution de problèmes", "Curiosité"],
    "L'Innovateur Durable": ["Créativité", "Compétences techniques", "Passion pour la durabilité", "Résolution de problèmes", "Innovation"]
};

export const question_weights: Record<string, Record<string, number>> = {
    "Q1": { "Teamwork": 0.3, "Independence": 0.3 },
    "Q2": { "Logical reasoning": 0.3, "Analytical skills": 0.25, "Creativity": 0.4, "Problem-solving": 0.25 },
    "Q3": { "Abstract thinking": 0.3, "Practicality": 0.3, "Innovation": 0.4, "Results-oriented mindset": 0.2 },
    "Q4": { "Emotional intelligence": 0.4, "Self-expression": 0.25, "Empathy": 0.4, "Compassion": 0.4 },
    "Q5": { "Risk-taking": 0.4, "Caution": 0.3, "Risk assessment": 0.25, "Strategic planning": 0.15 },
    "Q6": { "Love for numbers": 0.3, "Data interpretation": 0.25, "Analytical thinking": 0.3, "Pattern recognition": 0.15 },
    "Q7": { "Creativity": 0.4, "Technical skills": 0.25, "Innovation": 0.2, "Hands-on problem-solving": 0.15 },
    "Q8": { "Efficiency": 0.3, "Adaptability": 0.25, "Organization": 0.2, "Long-term thinking": 0.15 },
    "Q9": { "Empathy": 0.4, "Desire to help others": 0.25, "Mentorship": 0.2, "Advocacy": 0.15 },
    "Q10": { "Open-mindedness": 0.3, "Global perspective": 0.25, "Curiosity": 0.2, "Interdisciplinary thinking": 0.15 },
    "Q11": { "Attention to detail": 0.3, "Precision": 0.25, "Results-driven mindset": 0.2 },
    "Q12": { "Love for learning": 0.2, "Intellectual curiosity": 0.3, "Growth mindset": 0.2, "Self-improvement": 0.1 },
    "Q13": { "Leadership": 0.3, "Decision-making": 0.25, "Strategic thinking": 0.2, "Vision for the future": 0.15 },
    "Q14": { "Passion for sustainability": 0.4, "Advocacy": 0.25, "Global perspective": 0.2, "Problem-solving": 0.15 },
    "Q15": { "Physical fitness": 0.4, "Love for nature": 0.25, "Resilience": 0.2 },
    "Q16": { "Hands-on problem-solving": 0.3, "Technical skills": 0.25, "Innovation": 0.2, "Practicality": 0.15 },
    "Q17": { "Creativity": 0.4, "Self-expression": 0.25, "Imagination": 0.2, "Aesthetic sensitivity": 0.15 },
    "Q18": { "Conflict resolution": 0.3, "Diplomacy": 0.25, "Communication skills": 0.2 },
    "Q19": { "Organization": 0.3, "Efficiency": 0.25, "Strategic thinking": 0.2, "Long-term planning": 0.15 },
    "Q20": { "Communication skills": 0.4, "Confidence": 0.25, "Charisma": 0.2, "Emotional expression": 0.15 },
    "Q21": { "Technical expertise": 0.4, "Innovation": 0.25, "Forward-thinking mindset": 0.2, "Adaptability": 0.15 },
    "Q22": { "Adaptability": 0.3, "Resilience": 0.25, "Efficiency": 0.2, "Problem-solving": 0.15 },
    "Q23": { "Long-term thinking": 0.3, "Strategic planning": 0.25, "Ambition": 0.2, "Decision-making": 0.15 },
    "Q24": { "Multitasking": 0.3, "Adaptability": 0.25, "Organization": 0.2, "Efficiency": 0.15 },
    "Q25": { "Advocacy": 0.4, "Compassion": 0.25, "Global perspective": 0.2, "Desire to help others": 0.15 }
};

export const sub_profile_weights: Record<string, Record<string, number>> = {
    "The Researcher": {
        "Intellectual curiosity": 0.3,
        "Attention to detail": 0.25,
        "Love for learning": 0.2,
        "Abstract thinking": 0.15,
        "Patience": 0.1
    },
    "The Problem Solver": {
        "Logical reasoning": 0.3,
        "Analytical skills": 0.25,
        "Results-oriented mindset": 0.2,
        "Practicality": 0.15,
        "Critical thinking": 0.1
    },
    "The Data Enthusiast": {
        "Analytical thinking": 0.3,
        "Attention to detail": 0.25,
        "Love for numbers": 0.2,
        "Pattern recognition": 0.15,
        "Data interpretation": 0.1
    },
    "The Theorist": {
        "Deep thinking": 0.3,
        "Creativity in conceptualizing ideas": 0.25,
        "Intellectual rigor": 0.2,
        "Abstract reasoning": 0.15,
        "Curiosity": 0.1
    },
    "The Engineer": {
        "Technical skills": 0.3,
        "Problem-solving": 0.25,
        "Results-driven mindset": 0.2,
        "Precision": 0.15,
        "Innovation": 0.1
    },
    "The Artist": {
        "Creativity": 0.4,
        "Emotional intelligence": 0.25,
        "Self-expression": 0.15,
        "Imagination": 0.1,
        "Aesthetic sensitivity": 0.1
    },
    "The Innovator": {
        "Creativity": 0.4,
        "Technical expertise": 0.25,
        "Forward-thinking mindset": 0.15,
        "Risk-taking": 0.1,
        "Curiosity": 0.1
    },
    "The Storyteller": {
        "Creativity": 0.4,
        "Communication skills": 0.25,
        "Emotional intelligence": 0.15,
        "Narrative crafting": 0.1,
        "Empathy": 0.1
    },
    "The Performer": {
        "Charisma": 0.4,
        "Emotional expression": 0.25,
        "Stage presence": 0.15,
        "Confidence": 0.1,
        "Adaptability": 0.1
    },
    "The Designer": {
        "Creativity": 0.4,
        "Attention to detail": 0.25,
        "User-centered mindset": 0.15,
        "Visual thinking": 0.1,
        "Problem-solving": 0.1
    },
    "The Helper": {
        "Empathy": 0.4,
        "Patience": 0.25,
        "Desire to help others": 0.15,
        "Collaboration": 0.1,
        "Emotional intelligence": 0.1
    },
    "The Activist": {
        "Passion": 0.4,
        "Determination": 0.25,
        "Strong communication skills": 0.15,
        "Advocacy": 0.1,
        "Resilience": 0.1
    },
    "The Communicator": {
        "Interpersonal skills": 0.4,
        "Empathy": 0.25,
        "Adaptability": 0.15,
        "Dialogue facilitation": 0.1,
        "Relationship-building": 0.1
    },
    "The Educator": {
        "Patience": 0.4,
        "Communication skills": 0.25,
        "Love for learning": 0.15,
        "Knowledge-sharing": 0.1,
        "Mentorship": 0.1
    },
    "The Humanitarian": {
        "Compassion": 0.4,
        "Resilience": 0.25,
        "Global perspective": 0.15,
        "Problem-solving": 0.1,
        "Advocacy": 0.1
    },
    "The Entrepreneur": {
        "Leadership": 0.3,
        "Creativity": 0.25,
        "Results-oriented mindset": 0.2,
        "Risk-taking": 0.15,
        "Ambition": 0.1
    },
    "The Leader": {
        "Decision-making": 0.3,
        "Communication": 0.25,
        "Vision for the future": 0.2,
        "Strategic thinking": 0.15,
        "Confidence": 0.1
    },
    "The Strategist": {
        "Analytical thinking": 0.3,
        "Organization": 0.25,
        "Results-driven mindset": 0.2,
        "Efficiency": 0.15,
        "Long-term thinking": 0.1
    },
    "The Salesperson": {
        "Charisma": 0.3,
        "Persistence": 0.25,
        "Customer-focused mindset": 0.2,
        "Negotiation skills": 0.15,
        "Adaptability": 0.1
    },
    "The Investor": {
        "Analytical thinking": 0.3,
        "Risk assessment": 0.25,
        "Long-term perspective": 0.2,
        "Financial acumen": 0.15,
        "Strategic planning": 0.1
    },
    "The Generalist": {
        "Adaptability": 0.3,
        "Curiosity": 0.25,
        "Love for learning": 0.2,
        "Versatility": 0.15,
        "Broad skill set": 0.1
    },
    "The Integrator": {
        "Versatility": 0.3,
        "Creativity": 0.25,
        "Problem-solving": 0.2,
        "Interdisciplinary thinking": 0.15,
        "Adaptability": 0.1
    },
    "The Lifelong Learner": {
        "Curiosity": 0.3,
        "Adaptability": 0.25,
        "Growth mindset": 0.2,
        "Love for learning": 0.15,
        "Self-improvement": 0.1
    },
    "The Multipotentialite": {
        "Versatility": 0.3,
        "Creativity": 0.25,
        "Broad skill set": 0.2,
        "Adaptability": 0.15,
        "Curiosity": 0.1
    },
    "The Cultural Enthusiast": {
        "Open-mindedness": 0.3,
        "Communication skills": 0.25,
        "Global perspective": 0.2,
        "Curiosity": 0.15,
        "Adaptability": 0.1
    },
    "The Coder": {
        "Technical skills": 0.4,
        "Problem-solving": 0.25,
        "Love for coding": 0.15,
        "Logical thinking": 0.1,
        "Innovation": 0.1
    },
    "The Gadget Enthusiast": {
        "Technical skills": 0.4,
        "Creativity": 0.25,
        "Love for tinkering": 0.15,
        "Hands-on problem-solving": 0.1,
        "Curiosity": 0.1
    },
    "The Digital Creator": {
        "Creativity": 0.4,
        "Technical skills": 0.25,
        "User-centered mindset": 0.15,
        "Innovation": 0.1,
        "Adaptability": 0.1
    },
    "The Conservationist": {
        "Passion for nature": 0.4,
        "Problem-solving": 0.25,
        "Global perspective": 0.15,
        "Advocacy": 0.1,
        "Resilience": 0.1
    },
    "The Outdoor Adventurer": {
        "Physical fitness": 0.4,
        "Adaptability": 0.25,
        "Love for nature": 0.15,
        "Problem-solving": 0.1,
        "Curiosity": 0.1
    },
    "The Sustainable Innovator": {
        "Creativity": 0.4,
        "Technical skills": 0.25,
        "Passion for sustainability": 0.15,
        "Problem-solving": 0.1,
        "Innovation": 0.1
    },
    "The Project Manager": {
        "Leadership": 0.3,
        "Organization": 0.25,
        "Problem-solving": 0.2,
        "Efficiency": 0.15,
        "Strategic thinking": 0.1
    },
    "The Event Planner": {
        "Attention to detail": 0.3,
        "Communication": 0.25,
        "Creativity": 0.2,
        "Adaptability": 0.15,
        "Problem-solving": 0.1
    },
    "The Systems Thinker": {
        "Analytical thinking": 0.3,
        "Problem-solving": 0.25,
        "Results-driven mindset": 0.2,
        "Efficiency": 0.15,
        "Innovation": 0.1
    },
    "The Public Speaker": {
        "Charisma": 0.4,
        "Communication skills": 0.25,
        "Emotional intelligence": 0.15,
        "Influence": 0.1,
        "Adaptability": 0.1
    },
    "The Writer": {
        "Creativity": 0.4,
        "Communication skills": 0.25,
        "Attention to detail": 0.15,
        "Storytelling": 0.1,
        "Empathy": 0.1
    },
    "The Negotiator": {
        "Communication": 0.4,
        "Empathy": 0.25,
        "Problem-solving": 0.15,
        "Diplomacy": 0.1,
        "Adaptability": 0.1
    },
    "The Mentor": {
        "Empathy": 0.4,
        "Communication skills": 0.25,
        "Desire to help others": 0.15,
        "Leadership": 0.1,
        "Patience": 0.1
    },
    "The Wellness Advocate": {
        "Empathy": 0.4,
        "Communication skills": 0.25,
        "Passion for health": 0.15,
        "Problem-solving": 0.1,
        "Adaptability": 0.1
    }
};

// Answer scaling function with error handling
export function answerValue(answer: string, questionId: string): number {
    const answerScales: Record<string, Record<string, number>> = {
        "Q1": {
            "Strongly prefer teamwork": 1.0,
            "Prefer teamwork": 0.75,
            "Neutral": 0.5,
            "Prefer independence": 0.25,
            "Strongly prefer independence": 0.0
        },
        "Q2": {
            "Logical reasoning": 1.0,
            "Creative solutions": 0.75,
            "A mix of both": 0.5,
            "Avoid problems": 0.0
        },
        "Q3": {
            "Abstract ideas": 1.0,
            "Practical applications": 0.75,
            "Both equally": 0.5,
            "Neither": 0.0
        },
        "Q4": {
            "Very important": 1.0,
            "Important": 0.75,
            "Neutral": 0.5,
            "Not important": 0.25,
            "Not at all important": 0.0
        },
        "Q5": {
            "Strongly prefer risks": 1.0,
            "Prefer risks": 0.75,
            "Neutral": 0.5,
            "Prefer caution": 0.25,
            "Strongly prefer caution": 0.0
        },
        "Q6": {
            "Love it": 1.0,
            "Enjoy it": 0.75,
            "Neutral": 0.5,
            "Dislike it": 0.25,
            "Hate it": 0.0
        },
        "Q7": {
            "Strongly prefer creative tasks": 1.0,
            "Prefer creative tasks": 0.75,
            "Neutral": 0.5,
            "Prefer technical tasks": 0.25,
            "Strongly prefer technical tasks": 0.0
        },
        "Q8": {
            "Very well": 1.0,
            "Well": 0.75,
            "Neutral": 0.5,
            "Poorly": 0.25,
            "Very poorly": 0.0
        },
        "Q9": {
            "Very important": 1.0,
            "Important": 0.75,
            "Neutral": 0.5,
            "Not important": 0.25,
            "Not at all important": 0.0
        },
        "Q10": {
            "Love it": 1.0,
            "Enjoy it": 0.75,
            "Neutral": 0.5,
            "Dislike it": 0.25,
            "Hate it": 0.0
        },
        "Q11": {
            "Very important": 1.0,
            "Important": 0.75,
            "Neutral": 0.5,
            "Not important": 0.25,
            "Not at all important": 0.0
        },
        "Q12": {
            "Love it": 1.0,
            "Enjoy it": 0.75,
            "Neutral": 0.5,
            "Dislike it": 0.25,
            "Hate it": 0.0
        },
        "Q13": {
            "Very well": 1.0,
            "Well": 0.75,
            "Neutral": 0.5,
            "Poorly": 0.25,
            "Very poorly": 0.0
        },
        "Q14": {
            "Very passionate": 1.0,
            "Passionate": 0.75,
            "Neutral": 0.5,
            "Not passionate": 0.25,
            "Not at all passionate": 0.0
        },
        "Q15": {
            "Love it": 1.0,
            "Enjoy it": 0.75,
            "Neutral": 0.5,
            "Dislike it": 0.25,
            "Hate it": 0.0
        },
        "Q16": {
            "Very well": 1.0,
            "Well": 0.75,
            "Neutral": 0.5,
            "Poorly": 0.25,
            "Very poorly": 0.0
        },
        "Q17": {
            "Very important": 1.0,
            "Important": 0.75,
            "Neutral": 0.5,
            "Not important": 0.25,
            "Not at all important": 0.0
        },
        "Q18": {
            "Very well": 1.0,
            "Well": 0.75,
            "Neutral": 0.5,
            "Poorly": 0.25,
            "Very poorly": 0.0
        },
        "Q19": {
            "Very important": 1.0,
            "Important": 0.75,
            "Neutral": 0.5,
            "Not important": 0.25,
            "Not at all important": 0.0
        },
        "Q20": {
            "Love it": 1.0,
            "Enjoy it": 0.75,
            "Neutral": 0.5,
            "Dislike it": 0.25,
            "Hate it": 0.0
        },
        "Q21": {
            "Very important": 1.0,
            "Important": 0.75,
            "Neutral": 0.5,
            "Not important": 0.25,
            "Not at all important": 0.0
        },
        "Q22": {
            "Love it": 1.0,
            "Enjoy it": 0.75,
            "Neutral": 0.5,
            "Dislike it": 0.25,
            "Hate it": 0.0
        },
        "Q23": {
            "Very important": 1.0,
            "Important": 0.75,
            "Neutral": 0.5,
            "Not important": 0.25,
            "Not at all important": 0.0
        },
        "Q24": {
            "Love it": 1.0,
            "Enjoy it": 0.75,
            "Neutral": 0.5,
            "Dislike it": 0.25,
            "Hate it": 0.0
        },
        "Q25": {
            "Very important": 1.0,
            "Important": 0.75,
            "Neutral": 0.5,
            "Not important": 0.25,
            "Not at all important": 0.0
        }
    };

    try {
        const scale = answerScales[questionId];
        if (!scale) {
            console.warn(`No scale found for question ${questionId}`);
            return 0.0;
        }
        return scale[answer] ?? 0.0;
    } catch (error) {
        console.error(`Error processing answer value for ${questionId}:`, error);
        return 0.0;
    }
}

// Profile calculation with validation
export function calculateProfileScores(userAnswers: Record<string, string>): Record<string, number> {
    const profileScores: Record<string, number> = { ...key_traits };

    try {
        for (const [questionId, answer] of Object.entries(userAnswers)) {
            const weights = question_weights[questionId];
            if (weights) {
                for (const [trait, weight] of Object.entries(weights)) {
                    profileScores[trait] = (profileScores[trait] || 0) + weight * answerValue(answer, questionId);
                }
            }
        }
    } catch (error) {
        console.error('Error calculating profile scores:', error);
    }

    return profileScores;
}

// Profile matching with validation
export function getMatchedProfile(profileScores: Record<string, number>): string {
    try {
        let maxScore = -1;
        let matchedProfile = "";

        for (const [profile, traits] of Object.entries(sub_profiles)) {
            const weights = sub_profile_weights[profile];
            if (!weights) continue;

            let score = 0;
            for (const trait of traits) {
                if (profileScores[trait] !== undefined && weights[trait] !== undefined) {
                    score += profileScores[trait] * weights[trait];
                }
            }

            if (score > maxScore) {
                maxScore = score;
                matchedProfile = profile;
            }
        }

        return matchedProfile || "Le Généraliste"; // Default fallback profile in French
    } catch (error) {
        console.error('Error getting matched profile:', error);
        return "Le Généraliste"; // Default fallback profile in French
    }
}

// Export for testing and debugging
export const __testing = {
    answerValue,
    calculateProfileScores,
    getMatchedProfile
};
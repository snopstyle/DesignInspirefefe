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
    "Q1": { "Travail d'équipe": 0.3, "Indépendance": 0.3 },
    "Q2": { "Raisonnement logique": 0.3, "Compétences analytiques": 0.25, "Créativité": 0.4, "Résolution de problèmes": 0.25 },
    "Q3": { "Pensée abstraite": 0.3, "Pragmatisme": 0.3, "Innovation": 0.4, "Orientation résultats": 0.2 },
    "Q4": { "Intelligence émotionnelle": 0.4, "Expression personnelle": 0.25, "Empathie": 0.4, "Compassion": 0.4 },
    "Q5": { "Prise de risque": 0.4, "Prudence": 0.3, "Évaluation des risques": 0.25, "Planification stratégique": 0.15 },
    "Q6": { "Amour des chiffres": 0.3, "Interprétation des données": 0.25, "Pensée analytique": 0.3, "Reconnaissance des modèles": 0.15 },
    "Q7": { "Créativité": 0.4, "Compétences techniques": 0.25, "Innovation": 0.2, "Résolution pratique de problèmes": 0.15 },
    "Q8": { "Efficacité": 0.3, "Adaptabilité": 0.25, "Organisation": 0.2, "Réflexion à long terme": 0.15 },
    "Q9": { "Empathie": 0.4, "Désir d'aider les autres": 0.25, "Mentorat": 0.2, "Plaidoyer": 0.15 },
    "Q10": { "Ouverture d'esprit": 0.3, "Perspective globale": 0.25, "Curiosité": 0.2, "Pensée interdisciplinaire": 0.15 },
    "Q11": { "Attention aux détails": 0.3, "Précision": 0.25, "Orientation résultats": 0.2 },
    "Q12": { "Amour de l'apprentissage": 0.2, "Curiosité intellectuelle": 0.3, "Esprit de croissance": 0.2, "Développement personnel": 0.1 },
    "Q13": { "Leadership": 0.3, "Prise de décision": 0.25, "Pensée stratégique": 0.2, "Vision d'avenir": 0.15 },
    "Q14": { "Passion pour la durabilité": 0.4, "Plaidoyer": 0.25, "Perspective globale": 0.2, "Résolution de problèmes": 0.15 },
    "Q15": { "Condition physique": 0.4, "Amour de la nature": 0.25, "Résilience": 0.2 },
    "Q16": { "Résolution pratique de problèmes": 0.3, "Compétences techniques": 0.25, "Innovation": 0.2, "Pragmatisme": 0.15 },
    "Q17": { "Créativité": 0.4, "Expression personnelle": 0.25, "Imagination": 0.2, "Sensibilité esthétique": 0.15 },
    "Q18": { "Résolution de conflits": 0.3, "Diplomatie": 0.25, "Compétences en communication": 0.2 },
    "Q19": { "Organisation": 0.3, "Efficacité": 0.25, "Pensée stratégique": 0.2, "Planification à long terme": 0.15 },
    "Q20": { "Compétences en communication": 0.4, "Confiance": 0.25, "Charisme": 0.2, "Expression émotionnelle": 0.15 },
    "Q21": { "Expertise technique": 0.4, "Innovation": 0.25, "Esprit tourné vers l'avenir": 0.2, "Adaptabilité": 0.15 },
    "Q22": { "Adaptabilité": 0.3, "Résilience": 0.25, "Efficacité": 0.2, "Résolution de problèmes": 0.15 },
    "Q23": { "Réflexion à long terme": 0.3, "Planification stratégique": 0.25, "Ambition": 0.2, "Prise de décision": 0.15 },
    "Q24": { "Multitâche": 0.3, "Adaptabilité": 0.25, "Organisation": 0.2, "Efficacité": 0.15 },
    "Q25": { "Plaidoyer": 0.4, "Compassion": 0.25, "Perspective globale": 0.2, "Désir d'aider les autres": 0.15 }
};

export const sub_profile_weights: Record<string, Record<string, number>> = {
    "Le Chercheur": {
        "Curiosité intellectuelle": 0.3,
        "Attention aux détails": 0.25,
        "Amour de l'apprentissage": 0.2,
        "Pensée abstraite": 0.15,
        "Patience": 0.1
    },
    "Le Solutionneur": {
        "Raisonnement logique": 0.3,
        "Compétences analytiques": 0.25,
        "Orientation résultats": 0.2,
        "Pragmatisme": 0.15,
        "Pensée critique": 0.1
    },
    "L'Analyste de Données": {
        "Pensée analytique": 0.3,
        "Attention aux détails": 0.25,
        "Amour des chiffres": 0.2,
        "Reconnaissance des modèles": 0.15,
        "Interprétation des données": 0.1
    },
    "Le Théoricien": {
        "Pensée profonde": 0.3,
        "Créativité conceptuelle": 0.25,
        "Rigueur intellectuelle": 0.2,
        "Raisonnement abstrait": 0.15,
        "Curiosité": 0.1
    },
    "L'Ingénieur": {
        "Compétences techniques": 0.3,
        "Résolution de problèmes": 0.25,
        "Orientation résultats": 0.2,
        "Précision": 0.15,
        "Innovation": 0.1
    },
    "L'Artiste": {
        "Créativité": 0.4,
        "Intelligence émotionnelle": 0.25,
        "Expression personnelle": 0.15,
        "Imagination": 0.1,
        "Sensibilité esthétique": 0.1
    },
    "L'Innovateur": {
        "Créativité": 0.4,
        "Expertise technique": 0.25,
        "Vision d'avenir": 0.15,
        "Prise de risque": 0.1,
        "Curiosité": 0.1
    },
    "Le Narrateur": {
        "Créativité": 0.4,
        "Compétences en communication": 0.25,
        "Intelligence émotionnelle": 0.15,
        "Construction narrative": 0.1,
        "Empathie": 0.1
    },
    "L'Interprète": {
        "Charisme": 0.4,
        "Expression émotionnelle": 0.25,
        "Présence scénique": 0.15,
        "Confiance": 0.1,
        "Adaptabilité": 0.1
    },
    "Le Designer": {
        "Créativité": 0.4,
        "Attention aux détails": 0.25,
        "Approche centrée utilisateur": 0.15,
        "Pensée visuelle": 0.1,
        "Résolution de problèmes": 0.1
    },
    "L'Aidant": {
        "Empathie": 0.4,
        "Patience": 0.25,
        "Désir d'aider les autres": 0.15,
        "Collaboration": 0.1,
        "Intelligence émotionnelle": 0.1
    },
    "L'Activiste": {
        "Passion": 0.4,
        "Détermination": 0.25,
        "Compétences en communication": 0.15,
        "Plaidoyer": 0.1,
        "Résilience": 0.1
    },
    "Le Communicant": {
        "Compétences interpersonnelles": 0.4,
        "Empathie": 0.25,
        "Adaptabilité": 0.15,
        "Facilitation du dialogue": 0.1,
        "Construction de relations": 0.1
    },
    "L'Éducateur": {
        "Patience": 0.4,
        "Compétences en communication": 0.25,
        "Amour de l'apprentissage": 0.15,
        "Partage des connaissances": 0.1,
        "Mentorat": 0.1
    },
    "L'Humanitaire": {
        "Compassion": 0.4,
        "Résilience": 0.25,
        "Perspective globale": 0.15,
        "Résolution de problèmes": 0.1,
        "Plaidoyer": 0.1
    },
    "L'Entrepreneur": {
        "Leadership": 0.3,
        "Créativité": 0.25,
        "Orientation résultats": 0.2,
        "Prise de risque": 0.15,
        "Ambition": 0.1
    },
    "Le Leader": {
        "Prise de décision": 0.3,
        "Communication": 0.25,
        "Vision d'avenir": 0.2,
        "Pensée stratégique": 0.15,
        "Confiance": 0.1
    },
    "Le Stratège": {
        "Pensée analytique": 0.3,
        "Organisation": 0.25,
        "Orientation résultats": 0.2,
        "Efficacité": 0.15,
        "Réflexion à long terme": 0.1
    },
    "Le Commercial": {
        "Charisme": 0.3,
        "Persévérance": 0.25,
        "Orientation client": 0.2,
        "Compétences en négociation": 0.15,
        "Adaptabilité": 0.1
    },
    "L'Investisseur": {
        "Pensée analytique": 0.3,
        "Évaluation des risques": 0.25,
        "Vision à long terme": 0.2,
        "Acuité financière": 0.15,
        "Planification stratégique": 0.1
    },
    "Le Généraliste": {
        "Adaptabilité": 0.3,
        "Curiosité": 0.25,
        "Amour de l'apprentissage": 0.2,
        "Polyvalence": 0.15,
        "Large éventail de compétences": 0.1
    },
    "L'Intégrateur": {
        "Polyvalence": 0.3,
        "Créativité": 0.25,
        "Résolution de problèmes": 0.2,
        "Pensée interdisciplinaire": 0.15,
        "Adaptabilité": 0.1
    },
    "L'Apprenant Perpétuel": {
        "Curiosité": 0.3,
        "Adaptabilité": 0.25,
        "Mentalité de croissance": 0.2,
        "Amour de l'apprentissage": 0.15,
        "Développement personnel": 0.1
    },
    "Le Multipotentiel": {
        "Polyvalence": 0.3,
        "Créativité": 0.25,
        "Large éventail de compétences": 0.2,
        "Adaptabilité": 0.15,
        "Curiosité": 0.1
    },
    "L'Enthousiaste Culturel": {
        "Ouverture d'esprit": 0.3,
        "Compétences en communication": 0.25,
        "Perspective globale": 0.2,
        "Curiosité": 0.15,
        "Adaptabilité": 0.1
    },
    "Le Codeur": {
        "Compétences techniques": 0.4,
        "Résolution de problèmes": 0.25,
        "Passion pour le code": 0.15,
        "Pensée logique": 0.1,
        "Innovation": 0.1
    },
    "Le Passionné de Technologie": {
        "Compétences techniques": 0.4,
        "Créativité": 0.25,
        "Passion pour le bricolage": 0.15,
        "Résolution pratique": 0.1,
        "Curiosité": 0.1
    },
    "Le Créateur Numérique": {
        "Créativité": 0.4,
        "Compétences techniques": 0.25,
        "Approche centrée utilisateur": 0.15,
        "Innovation": 0.1,
        "Adaptabilité": 0.1
    },
    "Le Conservateur": {
        "Passion pour la nature": 0.4,
        "Résolution de problèmes": 0.25,
        "Perspective globale": 0.15,
        "Plaidoyer": 0.1,
        "Résilience": 0.1
    },
    "L'Aventurier": {
        "Condition physique": 0.4,
        "Adaptabilité": 0.25,
        "Amour de la nature": 0.15,
        "Résolution de problèmes": 0.1,
        "Curiosité": 0.1
    },
    "L'Innovateur Durable": {
        "Créativité": 0.4,
        "Compétences techniques": 0.25,
        "Passion pour la durabilité": 0.15,
        "Résolution de problèmes": 0.1,
        "Innovation": 0.1
    },
    "Le Chef de Projet": {
        "Leadership": 0.3,
        "Organisation": 0.25,
        "Résolution de problèmes": 0.2,
        "Efficacité": 0.15,
        "Pensée stratégique": 0.1
    },
    "L'Organisateur d'Événements": {
        "Attention aux détails": 0.3,
        "Communication": 0.25,
        "Créativité": 0.2,
        "Adaptabilité": 0.15,
        "Résolution de problèmes": 0.1
    },
    "Le Penseur Systémique": {
        "Pensée analytique": 0.3,
        "Résolution de problèmes": 0.25,
        "Orientation résultats": 0.2,
        "Efficacité": 0.15,
        "Innovation": 0.1
    },
    "L'Orateur": {
        "Charisme": 0.4,
        "Compétences en communication": 0.25,
        "Intelligence émotionnelle": 0.15,
        "Influence": 0.1,
        "Adaptabilité": 0.1
    },
    "L'Écrivain": {
        "Créativité": 0.4,
        "Compétences en communication": 0.25,
        "Attention aux détails": 0.15,
        "Narration": 0.1,
        "Empathie": 0.1
    },
    "Le Négociateur": {
        "Communication": 0.4,
        "Empathie": 0.25,
        "Résolution de problèmes": 0.15,
        "Diplomatie": 0.1,
        "Adaptabilité": 0.1
    },
    "Le Mentor": {
        "Empathie": 0.4,
        "Compétences en communication": 0.25,
        "Désir d'aider les autres": 0.15,
        "Leadership": 0.1,
        "Patience": 0.1
    },
    "Le Défenseur du Bien-être": {
        "Empathie": 0.4,
        "Compétences en communication": 0.25,
        "Passion pour la santé": 0.15,
        "Résolution de problèmes": 0.1,
        "Adaptabilité": 0.1
    }
};

// Answer scaling function with error handling
export function answerValue(answer: string, questionId: string): number {
    const answerScales: Record<string, Record<string, number>> = {
        "Q1": {
            "Forte préférence pour le travail d'équipe": 1.0,
            "Préférence pour le travail d'équipe": 0.75,
            "Neutre": 0.5,
            "Préférence pour l'indépendance": 0.25,
            "Forte préférence pour l'indépendance": 0.0
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
        console.log("Profile Scores:", profileScores);

        for (const [profile, weights] of Object.entries(sub_profile_weights)) {
            let score = 0;
            for (const [trait, weight] of Object.entries(weights)) {
                if (profileScores[trait] !== undefined) {
                    score += profileScores[trait] * weight;
                }
            }
            console.log(`Score for ${profile}:`, score);

            if (score > maxScore) {
                maxScore = score;
                matchedProfile = profile;
            }
        }

        console.log("Selected Profile:", matchedProfile, "with score:", maxScore);
        return matchedProfile || "Le Généraliste";
    } catch (error) {
        console.error('Error getting matched profile:', error);
        return "Le Généraliste";
    }
}

// Export for testing and debugging
export const __testing = {
    answerValue,
    calculateProfileScores,
    getMatchedProfile
};

import { Question } from './quiz-logic';

export const key_traits: Record<string, number> = {
    "Teamwork": 0,
    "Independence": 0,
    "Logical reasoning": 0,
    "Analytical skills": 0,
    "Creativity": 0,
    "Problem-solving": 0,
    "Abstract thinking": 0,
    "Practicality": 0,
    "Innovation": 0,
    "Results-oriented mindset": 0,
    "Emotional intelligence": 0,
    "Self-expression": 0,
    "Empathy": 0,
    "Compassion": 0,
    "Risk-taking": 0,
    "Caution": 0,
    "Risk assessment": 0,
    "Strategic planning": 0,
    "Love for numbers": 0,
    "Data interpretation": 0,
    "Analytical thinking": 0,
    "Pattern recognition": 0,
    "Love for learning": 0,
    "Intellectual curiosity": 0,
    "Growth mindset": 0,
    "Self-improvement": 0,
    "Attention to detail": 0,
    "Precision": 0,
    "Results-driven mindset": 0,
    "Leadership": 0,
    "Decision-making": 0,
    "Strategic thinking": 0,
    "Vision for the future": 0,
    "Passion for sustainability": 0,
    "Advocacy": 0,
    "Global perspective": 0,
    "Physical fitness": 0,
    "Love for nature": 0,
    "Resilience": 0,
    "Hands-on problem-solving": 0,
    "Technical skills": 0,
    "Imagination": 0,
    "Aesthetic sensitivity": 0,
    "Conflict resolution": 0,
    "Diplomacy": 0,
    "Communication skills": 0,
    "Organization": 0,
    "Efficiency": 0,
    "Long-term planning": 0,
    "Confidence": 0,
    "Charisma": 0,
    "Emotional expression": 0,
    "Technical expertise": 0,
    "Forward-thinking mindset": 0,
    "Adaptability": 0,
    "Multitasking": 0,
    "Ambition": 0,
    "Desire to help others": 0
};

export const sub_profiles: Record<string, string[]> = {
    "The Researcher": ["Intellectual curiosity", "Attention to detail", "Love for learning", "Abstract thinking", "Patience"],
    "The Problem Solver": ["Logical reasoning", "Analytical skills", "Results-oriented mindset", "Practicality", "Critical thinking"],
    "The Data Enthusiast": ["Analytical thinking", "Attention to detail", "Love for numbers", "Pattern recognition", "Data interpretation"],
    "The Theorist": ["Deep thinking", "Creativity in conceptualizing ideas", "Intellectual rigor", "Abstract reasoning", "Curiosity"],
    "The Engineer": ["Technical skills", "Problem-solving", "Results-driven mindset", "Precision", "Innovation"],
    "The Artist": ["Creativity", "Emotional intelligence", "Self-expression", "Imagination", "Aesthetic sensitivity"],
    "The Innovator": ["Creativity", "Technical expertise", "Forward-thinking mindset", "Risk-taking", "Curiosity"],
    "The Storyteller": ["Creativity", "Communication skills", "Emotional intelligence", "Narrative crafting", "Empathy"],
    "The Performer": ["Charisma", "Emotional expression", "Stage presence", "Confidence", "Adaptability"],
    "The Designer": ["Creativity", "Attention to detail", "User-centered mindset", "Visual thinking", "Problem-solving"],
    "The Helper": ["Empathy", "Patience", "Desire to help others", "Collaboration", "Emotional intelligence"],
    "The Activist": ["Passion", "Determination", "Strong communication skills", "Advocacy", "Resilience"],
    "The Communicator": ["Interpersonal skills", "Empathy", "Adaptability", "Dialogue facilitation", "Relationship-building"],
    "The Educator": ["Patience", "Communication skills", "Love for learning", "Knowledge-sharing", "Mentorship"],
    "The Humanitarian": ["Compassion", "Resilience", "Global perspective", "Problem-solving", "Advocacy"],
    "The Entrepreneur": ["Leadership", "Creativity", "Results-oriented mindset", "Risk-taking", "Ambition"],
    "The Leader": ["Decision-making", "Communication", "Vision for the future", "Strategic thinking", "Confidence"],
    "The Strategist": ["Analytical thinking", "Organization", "Results-driven mindset", "Efficiency", "Long-term thinking"],
    "The Salesperson": ["Charisma", "Persistence", "Customer-focused mindset", "Negotiation skills", "Adaptability"],
    "The Investor": ["Analytical thinking", "Risk assessment", "Long-term perspective", "Financial acumen", "Strategic planning"],
    "The Generalist": ["Adaptability", "Curiosity", "Love for learning", "Versatility", "Broad skill set"],
    "The Integrator": ["Versatility", "Creativity", "Problem-solving", "Interdisciplinary thinking", "Adaptability"],
    "The Lifelong Learner": ["Curiosity", "Adaptability", "Growth mindset", "Love for learning", "Self-improvement"],
    "The Multipotentialite": ["Versatility", "Creativity", "Broad skill set", "Adaptability", "Curiosity"],
    "The Cultural Enthusiast": ["Open-mindedness", "Communication skills", "Global perspective", "Curiosity", "Adaptability"],
    "The Coder": ["Technical skills", "Problem-solving", "Love for coding", "Logical thinking", "Innovation"],
    "The Gadget Enthusiast": ["Technical skills", "Creativity", "Love for tinkering", "Hands-on problem-solving", "Curiosity"],
    "The Digital Creator": ["Creativity", "Technical skills", "User-centered mindset", "Innovation", "Adaptability"],
    "The Conservationist": ["Passion for nature", "Problem-solving", "Global perspective", "Advocacy", "Resilience"],
    "The Outdoor Adventurer": ["Physical fitness", "Adaptability", "Love for nature", "Problem-solving", "Curiosity"],
    "The Sustainable Innovator": ["Creativity", "Technical skills", "Passion for sustainability", "Problem-solving", "Innovation"],
    "The Project Manager": ["Leadership", "Organization", "Problem-solving", "Efficiency", "Strategic thinking"],
    "The Event Planner": ["Attention to detail", "Communication", "Creativity", "Adaptability", "Problem-solving"],
    "The Systems Thinker": ["Analytical thinking", "Problem-solving", "Results-driven mindset", "Efficiency", "Innovation"],
    "The Public Speaker": ["Charisma", "Communication skills", "Emotional intelligence", "Influence", "Adaptability"],
    "The Writer": ["Creativity", "Communication skills", "Attention to detail", "Storytelling", "Empathy"],
    "The Negotiator": ["Communication", "Empathy", "Problem-solving", "Diplomacy", "Adaptability"],
    "The Mentor": ["Empathy", "Communication skills", "Desire to help others", "Leadership", "Patience"],
    "The Wellness Advocate": ["Empathy", "Communication skills", "Passion for health", "Problem-solving", "Adaptability"]
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

export const adaptiveTree: Record<string, Record<string, string>> = {
    "Q1": {
        "Strongly prefer teamwork": "Q9",
        "Prefer teamwork": "Q9",
        "Neutral": "Q2",
        "Prefer independence": "Q2",
        "Strongly prefer independence": "Q2"
    },
    "Q2": {
        "Logical reasoning": "Q3",
        "Creative solutions": "Q7",
        "A mix of both": "Q6",
        "Avoid problems": "Q6"
    },
    "Q3": {
        "Abstract ideas": "Q4",
        "Practical applications": "Q5",
        "Both equally": "Q10",
        "Neither": "Q10"
    },
    "Q4": {
        "Very important": "Q9",
        "Important": "Q13",
        "Neutral": "Q8",
        "Not important": "Q8",
        "Not at all important": "Q8"
    },
    "Q5": {
        "Strongly prefer risks": "Q7",
        "Prefer risks": "Q7",
        "Neutral": "Q12",
        "Prefer caution": "Q11",
        "Strongly prefer caution": "Q11"
    }
};

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
        }
    };

    const scale = answerScales[questionId] || {};
    return scale[answer] || 0.0;
}

export function calculateProfileScores(userAnswers: Record<string, string>): Record<string, number> {
    const profileScores: Record<string, number> = { ...key_traits };

    for (const [questionId, answer] of Object.entries(userAnswers)) {
        if (question_weights[questionId]) {
            for (const [trait, weight] of Object.entries(question_weights[questionId])) {
                profileScores[trait] += weight * answerValue(answer, questionId);
            }
        }
    }

    return profileScores;
}

export function getMatchedProfile(profileScores: Record<string, number>): string {
    let maxScore = -1;
    let matchedProfile = "";

    for (const [profile, traits] of Object.entries(sub_profiles)) {
        let score = 0;
        for (const trait of traits) {
            score += profileScores[trait] * 0.2; // Equal weight for each trait
        }
        if (score > maxScore) {
            maxScore = score;
            matchedProfile = profile;
        }
    }

    return matchedProfile;
}

export function getNextQuestion(currentQuestion: string, userAnswer: string): string {
    const nextQuestion = adaptiveTree[currentQuestion]?.[userAnswer] || "End";
    return nextQuestion;
}

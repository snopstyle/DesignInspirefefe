import { type Question } from './quiz-logic';

// Core data structures
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
    "Long-term thinking": 0,
    "Ambition": 0,
    "Multitasking": 0,
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

        return matchedProfile;
    } catch (error) {
        console.error('Error getting matched profile:', error);
        return "The Generalist"; // Default fallback profile
    }
}

// Adaptive question flow
export function getNextQuestion(currentQuestion: string, userAnswer: string): string {
    try {
        return adaptiveTree[currentQuestion]?.[userAnswer] || "End";
    } catch (error) {
        console.error('Error getting next question:', error);
        return "End";
    }
}

export const adaptiveTree: Record<string, Record<string, string>> = {
    // Step 1: Initial Questions (Q1–Q7)
    "Q1": {  // Do you prefer working in a team or independently?
        "Strongly prefer teamwork": "Q9",
        "Prefer teamwork": "Q9",
        "Neutral": "Q2",
        "Prefer independence": "Q2",
        "Strongly prefer independence": "Q2"
    },
    "Q2": {  // How do you approach solving complex problems?
        "Logical reasoning": "Q3",
        "Creative solutions": "Q7",
        "A mix of both": "Q6",
        "Avoid problems": "Q6"
    },
    "Q3": {  // Are you more interested in abstract ideas or practical applications?
        "Abstract ideas": "Q4",
        "Practical applications": "Q5",
        "Both equally": "Q10",
        "Neither": "Q10"
    },
    "Q4": {  // How important is emotional expression in your daily life?
        "Very important": "Q9",
        "Important": "Q13",
        "Neutral": "Q8",
        "Not important": "Q8",
        "Not at all important": "Q8"
    },
    "Q5": {  // Do you enjoy taking risks or prefer a more cautious approach?
        "Strongly prefer risks": "Q7",
        "Prefer risks": "Q7",
        "Neutral": "Q12",
        "Prefer caution": "Q11",
        "Strongly prefer caution": "Q11"
    },
    "Q6": {  // How do you feel about working with numbers and data?
        "Love it": "Q11",
        "Enjoy it": "Q12",
        "Neutral": "Q13",
        "Dislike it": "Q13",
        "Hate it": "Q13"
    },
    "Q7": {  // Are you more drawn to creative or technical tasks?
        "Strongly prefer creative tasks": "Q4",
        "Prefer creative tasks": "Q4",
        "Neutral": "Q10",
        "Prefer technical tasks": "Q6",
        "Strongly prefer technical tasks": "Q6"
    },

    // Step 2: Follow-Up Questions (Q8–Q18)
    "Q8": {  // How do you handle deadlines and time management?
        "Very well": "Q14",
        "Well": "Q15",
        "Neutral": "Q16",
        "Poorly": "Q16",
        "Very poorly": "Q16"
    },
    "Q9": {  // How important is it for you to help others?
        "Very important": "Q17",
        "Important": "Q18",
        "Neutral": "Q19",
        "Not important": "Q19",
        "Not at all important": "Q19"
    },
    "Q10": {  // Do you enjoy exploring new cultures and perspectives?
        "Love it": "Q20",
        "Enjoy it": "Q21",
        "Neutral": "Q22",
        "Dislike it": "Q22",
        "Hate it": "Q22"
    },
    "Q11": {  // How important is attention to detail in your work?
        "Very important": "Q23",
        "Important": "Q24",
        "Neutral": "Q25",
        "Not important": "Q25",
        "Not at all important": "Q25"
    },
    "Q12": {  // Do you enjoy learning new things?
        "Love it": "Q14",
        "Enjoy it": "Q15",
        "Neutral": "Q16",
        "Dislike it": "Q16",
        "Hate it": "Q16"
    },
    "Q13": {  // How do you handle leadership roles?
        "Very well": "Q17",
        "Well": "Q18",
        "Neutral": "Q19",
        "Poorly": "Q19",
        "Very poorly": "Q19"
    },
    "Q14": {  // Are you passionate about sustainability and environmental issues?
        "Very passionate": "Q20",
        "Passionate": "Q21",
        "Neutral": "Q22",
        "Not passionate": "Q22",
        "Not at all passionate": "Q22"
    },
    "Q15": {  // How do you feel about physical fitness and outdoor activities?
        "Love it": "Q23",
        "Enjoy it": "Q24",
        "Neutral": "Q25",
        "Dislike it": "Q25",
        "Hate it": "Q25"
    },
    "Q16": {  // How do you approach hands-on problem-solving?
        "Very well": "Q17",
        "Well": "Q18",
        "Neutral": "Q19",
        "Poorly": "Q19",
        "Very poorly": "Q19"
    },
    "Q17": {  // How important is it for you to express yourself creatively?
        "Very important": "Q20",
        "Important": "Q21",
        "Neutral": "Q22",
        "Not important": "Q22",
        "Not at all important": "Q22"
    },
    "Q18": {  // How do you handle conflict or disagreements?
        "Very well": "Q23",
        "Well": "Q24",
        "Neutral": "Q25",
        "Poorly": "Q25",
        "Very poorly": "Q25"
    },

    // Step 3: Final Questions (Q19–Q25)
    "Q19": {  // How important is it for you to follow a structured plan?
        "Very important": "End",
        "Important": "End",
        "Neutral": "End",
        "Not important": "End",
        "Not at all important": "End"
    },
    "Q20": {  // How do you feel about public speaking or presenting ideas?
        "Love it": "End",
        "Enjoy it": "End",
        "Neutral": "End",
        "Dislike it": "End",
        "Hate it": "End"
    },
    "Q21": {  // How important is it for you to stay up-to-date with technology?
        "Very important": "End",
        "Important": "End",
        "Neutral": "End",
        "Not important": "End",
        "Not at all important": "End"
    },
    "Q22": {  // How do you feel about working in a fast-paced environment?
        "Love it": "End",
        "Enjoy it": "End",
        "Neutral": "End",
        "Dislike it": "End",
        "Hate it": "End"
    },
    "Q23": {  // How important is it for you to have a clear career path?
        "Very important": "End",
        "Important": "End",
        "Neutral": "End",
        "Not important": "End",
        "Not at all important": "End"
    },
    "Q24": {  // How do you feel about working on multiple projects at once?
        "Love it": "End",
        "Enjoy it": "End",
        "Neutral": "End",
        "Dislike it": "End",
        "Hate it": "End"
    },
    "Q25": {  // How important is it for you to have a positive impact on society?
        "Very important": "End",
        "Important": "End",
        "Neutral": "End",
        "Not important": "End",
        "Not at all important": "End"
    }
};
// Export for testing and debugging
export const __testing = {
    answerValue,
    calculateProfileScores,
    getMatchedProfile,
    getNextQuestion
};

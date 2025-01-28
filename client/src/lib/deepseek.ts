
import type { QuizAnswers } from './quiz-logic';

export async function askDeepSeek(message: string) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get response from DeepSeek');
    }
    
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error calling DeepSeek:', error);
    throw error;
  }
}

export async function analyzePersonality(answers: QuizAnswers) {
  const prompt = `En tant qu'expert en analyse de personnalité pour la Génération Z, analyse ces réponses et crée un profil personnalisé qui parle directement au répondant. Utilise le tutoiement et un ton décontracté mais impactant:

${JSON.stringify(answers, null, 2)}

Structure l'analyse avec:
- PROFIL DOMINANT: Décris leur trait de personnalité principal de façon directe et moderne
- PROFIL AFFINÉ: Explique leur personnalité plus en détail avec des références actuelles
- FORCES: Liste leurs superpouvoirs avec des emojis pertinents
- FAIBLESSES: Présente leurs points d'amélioration de façon constructive
- CITATION INSPIRANTE: Choisis une citation d'un influenceur ou d'une personnalité Gen Z qui résonne avec leur profil
- TON ESSENCE: Un paragraphe qui capture leur personnalité avec des références à la culture pop actuelle
- SQUAD GOALS: Liste des célébrités/créateurs de contenu français et internationaux qui partagent leur personnalité
- TON FUTUR: Suggestions de carrières modernes et émergentes qui correspondent à leur profil

Utilise un langage jeune, des références actuelles (TikTok, Instagram, YouTube), et reste authentique. Évite tout langage corporate ou trop formel.`;

  return askDeepSeek(prompt);
}

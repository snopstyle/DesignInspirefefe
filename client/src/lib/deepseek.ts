
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
  const prompt = `En tant que coach de vie et d'orientation pour la Génération Z, analyse ces réponses et crée un profil personnalisé authentique et engageant. Réponds directement au répondant en le tutoyant, avec un ton chaleureux et impactant:

${JSON.stringify(answers, null, 2)}

Structure ta réponse en français avec:

PROFIL DOMINANT:
Une phrase courte et percutante qui capture l'essence de leur personnalité

FORCES 💪:
3-4 superpouvoirs clés avec des emojis pertinents

FAIBLESSES 🔄:
2-3 points d'amélioration présentés de manière constructive

CITATION INSPIRANTE 💭:
Une citation d'un influenceur, artiste ou entrepreneur qui résonne avec leur profil (privilégier des personnalités françaises Gen Z)

TON ESSENCE EN QUELQUES MOTS:
Un court paragraphe personnel et touchant qui décrit qui ils sont vraiment

SQUAD:
3-4 personnalités inspirantes (YouTubeurs, créateurs de contenu, entrepreneurs) qui partagent leur type de personnalité

MÉTIERS FAITS POUR TOI:
4-5 suggestions de carrières modernes et émergentes qui correspondent à leur profil

Utilise un style direct, jeune et authentique. Évite le jargon corporate et reste humain.`;

  return askDeepSeek(prompt);
}


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
  // Récupérer les questions depuis le fichier quiz-data.json
  const quizData = await import('./quiz-data.json');
  
  // Créer un objet qui combine questions et réponses
  const fullContext = Object.entries(answers).map(([questionId, answer]) => {
    const question = quizData.questions.find(q => `Q${q.id}` === questionId);
    return {
      question: question?.text || "Question inconnue",
      options: question?.options || [],
      answer: answer
    };
  });

  const prompt = `En tant que coach de vie et d'orientation pour la Génération Z, analyse ce profil basé sur les questions et réponses suivantes. Réponds directement au répondant en le tutoyant, avec un ton chaleureux et impactant:

Questions et Réponses:
${JSON.stringify(fullContext, null, 2)}

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

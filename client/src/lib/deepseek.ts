
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
  const prompt = `En tant qu'expert en analyse de personnalité, analyse les réponses suivantes au questionnaire et fournis une analyse détaillée en français. Utilise un ton engageant et professionnel:

${JSON.stringify(answers, null, 2)}

Structure ton analyse avec:
- Profil dominant
- Profil affiné
- Forces
- Faiblesses
- Citation qui résume parfaitement la personnalité
- Texte explicatif de personnalité
- Célébrités au profil similaire
- Métiers conseillés

Adopte un ton à la fois fun et sérieux dans ton analyse.`;

  return askDeepSeek(prompt);
}

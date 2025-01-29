export async function askOpenRouter(message: string) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from OpenRouter');
    }

    const data = await response.json();
    if (data.error) {
      if (data.error.code === 402) {
        throw new Error("Le service d'analyse est temporairement indisponible. Veuillez réessayer plus tard.");
      }
      throw new Error(data.error.message || "Une erreur est survenue");
    }
    return data.message;
  } catch (error) {
    console.error('Error calling OpenRouter:', error);
    throw error instanceof Error ? error : new Error("Une erreur inattendue est survenue");
  }
}

export async function analyzePersonality(answers: Record<string, any>) {
  const quizData = await import('./quiz-data.json');
  const questionsAndAnswers = Object.entries(answers).map(([questionId, answer]) => {
    const question = quizData.questions.find(q => `Q${q.id}` === questionId);
    return {
      question: question?.text,
      options: question?.options,
      answer: answer
    };
  });

  const prompt = `Analyse psycho-sociale du profil Gen Z. Tutoiement requis.

Réponses:
${JSON.stringify(questionsAndAnswers)}

Structure de réponse:

PROFIL DOMINANT:
Brève analyse psycho-sociale.

ANALYSE DÉTAILLÉE:
15-20 lignes sur pensée et interactions.

FORCES:
Forces majeures avec exemples.

CITATION:
Citation pertinente.

MODÈLES:
Personnalités similaires.

ORIENTATION:
• Domaines et recommandations académiques.`;

  return askOpenRouter(prompt);
}
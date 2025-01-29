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

  const prompt = `En tant que coach de vie et d'orientation pour la Génération Z, analyse ce profil basé sur ces questions et réponses. Crée un profil personnalisé authentique qui parle directement au répondant. Utilise le tutoiement et un ton engageant adapté à la Gen Z française.

Voici les réponses détaillées du répondant:
${JSON.stringify(questionsAndAnswers, null, 2)}

Structure ta réponse en français avec la structure suivante:

PROFIL DOMINANT:
Une analyse détaillée (2-3 phrases) de la dominante psycho-sociale spécifique du répondant, basée sur l'ensemble de ses réponses.

ANALYSE DU PROFIL PSYCHO-SOCIAL:
Un texte professionnel de 15-20 lignes analysant en détail le mode de fonctionnement du répondant, ses schémas de pensée, ses motivations profondes et sa façon d'interagir avec le monde. Cette analyse doit être nourrie par les réponses spécifiques au questionnaire.

FORCES PRINCIPALES:
Une analyse approfondie des 3-4 forces majeures qui émergent du profil, avec des exemples concrets de leur manifestation.

CITATION RÉVÉLATRICE:
Une citation significative d'un penseur, philosophe ou personnalité historique qui résonne particulièrement avec l'essence du profil analysé.

MODÈLES INSPIRANTS:
Une ou deux personnalités historiques ou contemporaines dont le parcours et le profil font écho aux caractéristiques du répondant. Expliquer les parallèles.

ORIENTATION ACADÉMIQUE:
• Liste structurée des domaines d'études les plus adaptés au profil
• Analyse des convergences entre les aspirations personnelles et les voies académiques suggérées
• Recommandations spécifiques basées sur les réponses aux questions sur le projet d'études

Utilise un style professionnel, nuancé et analytique. L'analyse doit être détaillée et rigoureuse, en évitant les généralisations.`;

  return askOpenRouter(prompt);
}
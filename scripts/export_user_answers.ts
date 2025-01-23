
import { db } from '../db';
import { quizResults } from '../db/schemas/quiz';
import { writeFileSync } from 'fs';

async function exportUserAnswers() {
  const results = await db.select().from(quizResults);
  
  const formattedResults = results.map(result => ({
    id: result.id,
    userId: result.userId,
    answers: result.answers,
    timestamp: result.createdAt,
    profileMatchScores: result.profileMatchScores,
    dominantProfile: result.dominantProfile
  }));

  writeFileSync(
    'user_answers_export.json',
    JSON.stringify(formattedResults, null, 2)
  );

  console.log(`Exported ${results.length} quiz results`);
}

exportUserAnswers()
  .catch(console.error)
  .finally(() => process.exit(0));

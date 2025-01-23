
import { writeFileSync } from 'fs';
import { join } from 'path';

const generateMockQuestions = () => {
  const questions = [];
  const sections = ['Personality', 'Skills', 'Interests', 'Values'];
  
  for (let i = 1; i <= 40; i++) {
    const section = sections[Math.floor((i-1) / 10)];
    questions.push({
      id: i,
      section: section,
      text: `Sample ${section} Question ${i}`,
      options: [
        `${section} Option A`,
        `${section} Option B`,
        `${section} Option C`,
        `${section} Option D`
      ],
      format: i % 3 === 0 ? "Multiple selection" : "Single choice"
    });
  }

  return { questions };
};

const mockData = generateMockQuestions();
const outputPath = join(process.cwd(), 'client/src/lib/quiz-data.json');

writeFileSync(outputPath, JSON.stringify(mockData, null, 2));
console.log(`Generated mock quiz data with ${mockData.questions.length} questions`);

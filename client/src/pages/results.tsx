
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { GradientBackground } from '@/components/layout/gradient-background';
import { Button } from '@/components/ui/button';
import { LoadingAnimation } from '@/components/ui/loading-animation';
import { analyzePersonality } from '@/lib/deepseek';
import { motion } from 'framer-motion';

export default function Results() {
  const [, setLocation] = useLocation();
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const answers = sessionStorage.getItem('quizAnswers');
        if (!answers) {
          setLocation('/quiz');
          return;
        }

        setIsLoading(true);
        const result = await analyzePersonality(JSON.parse(answers));
        setAnalysis(result);
      } catch (error) {
        console.error('Error loading results:', error);
        setAnalysis(error instanceof Error ? error.message : "Désolé, une erreur est survenue lors de l'analyse de vos réponses. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [setLocation]);

  if (isLoading) {
    return (
      <GradientBackground>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingAnimation />
        </div>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <div className="min-h-screen w-full max-w-4xl mx-auto py-12 px-4 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-[85px] font-black">
            <span className="bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-['Unbounded']">
              RÉSULTATS
            </span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Voici ton analyse personnalisée basée sur tes réponses au questionnaire
          </p>
        </motion.div>

        <div className="prose prose-invert max-w-none space-y-12">
          {analysis.split('\n').map((paragraph, index) => {
            if (paragraph.includes(':')) {
              const [title, content] = paragraph.split(':');
              if (content) {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-4"
                  >
                    <h2 className="text-3xl font-black bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      {title.trim()}
                    </h2>
                    <div className="text-xl leading-relaxed font-light text-gray-100">
                      {content.trim()}
                    </div>
                  </motion.div>
                );
              }
            }
            if (paragraph.trim()) {
              return (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-xl leading-relaxed font-light text-gray-100"
                >
                  {paragraph}
                </motion.p>
              );
            }
            return null;
          })}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center pt-8"
        >
          <Button 
            onClick={() => setLocation('/search')}
            className="bg-white/10 hover:bg-white/20 text-white text-lg px-8 py-6"
          >
            Découvrir les Formations
          </Button>
        </motion.div>
      </div>
    </GradientBackground>
  );
}

import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { GradientBackground } from '@/components/layout/gradient-background';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingAnimation } from '@/components/ui/loading-animation';
import { analyzePersonality } from '@/lib/deepseek';

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
      <div className="container mx-auto py-8 space-y-6">
        <Card className="bg-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white">TON ANALYSE DE PERSONNALITÉ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              {analysis.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('- ')) {
                  const title = paragraph.substring(2).split(':')[0];
                  const content = paragraph.split(':')[1];
                  return (
                    <div key={index} className="mb-6">
                      <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">
                        {title}
                      </h2>
                      <p className="text-gray-100 text-lg leading-relaxed">
                        {content}
                      </p>
                    </div>
                  );
                }
                return (
                  <p key={index} className="text-gray-100 text-lg leading-relaxed mb-4">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center pt-4">
          <Button onClick={() => setLocation('/search')}>
            Découvrir les Formations
          </Button>
        </div>
      </div>
    </GradientBackground>
  );
}
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
            <CardTitle>Votre Analyse de Personnalité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              {analysis.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
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
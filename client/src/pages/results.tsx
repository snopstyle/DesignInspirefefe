import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { calculateProfileScores, getMatchedProfile } from '@/lib/profile-logic';
import { GradientBackground } from '@/components/layout/gradient-background';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Results() {
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState<string | null>(null);

  useEffect(() => {
    const answers = sessionStorage.getItem('quizAnswers');
    if (!answers) {
      setLocation('/quiz');
      return;
    }

    const scores = calculateProfileScores(JSON.parse(answers));
    const matchedProfile = getMatchedProfile(scores);
    setProfile(matchedProfile);
  }, [setLocation]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <GradientBackground>
      <div className="container mx-auto py-8">
        <Card className="bg-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Votre profil</CardTitle>
            <CardDescription>{profile}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </GradientBackground>
  );
}
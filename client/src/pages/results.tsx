import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { calculateProfileScores, getMatchedProfile } from '@/lib/profile-logic';
import { GradientBackground } from '@/components/layout/gradient-background';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function Results() {
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState<string | null>(null);
  const profile_summaries = {
    "profile1": "Profile 1 description",
    "profile2": "Profile 2 description",
    // ... add more profiles
  };

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

  const profileDetails = profile_summaries[profile];
  const answers = JSON.parse(sessionStorage.getItem('quizAnswers') || '{}'); // added to access answers
  const scores = calculateProfileScores(answers);

  // Sort traits by score
  const sortedTraits = Object.entries(scores)
    .sort(([,a], [,b]) => b - a);

  return (
    <GradientBackground>
      <div className="container mx-auto py-8 space-y-4">
        <Card className="bg-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Votre profil</CardTitle>
            <CardDescription>{profileDetails}</CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Scores des traits</CardTitle>
            <CardDescription>Détail de vos scores pour chaque trait</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedTraits.map(([trait, score]) => (
                <div key={trait} className="flex justify-between items-center">
                  <span>{trait}</span>
                  <span className="font-mono">{score.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </GradientBackground>
  );
}
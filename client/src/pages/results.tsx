
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { calculateProfileScores, getMatchedProfile, dominant_profile_mapping } from '@/lib/profile-logic';
import { GradientBackground } from '@/components/layout/gradient-background';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function Results() {
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [dominantProfile, setDominantProfile] = useState<string>('');

  useEffect(() => {
    const answers = sessionStorage.getItem('quizAnswers');
    if (!answers) {
      setLocation('/quiz');
      return;
    }

    const calculatedScores = calculateProfileScores(JSON.parse(answers));
    const matchedProfile = getMatchedProfile(calculatedScores);
    setProfile(matchedProfile);
    setScores(calculatedScores);
    setDominantProfile(dominant_profile_mapping[matchedProfile] || '');
  }, [setLocation]);

  if (!profile || !scores) {
    return <div>Loading...</div>;
  }

  // Sort traits by score
  const sortedTraits = Object.entries(scores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const calculateMatchPercentage = (profile: string, scores: Record<string, number>): number => {
    // Simple calculation - can be refined based on your scoring logic
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const profileScore = sortedTraits.reduce((sum, [, score]) => sum + score, 0);
    return Math.round((profileScore / totalScore) * 100);
  };

  const matchPercentage = calculateMatchPercentage(profile, scores);

  return (
    <GradientBackground>
      <div className="container mx-auto py-8 space-y-4">
        {/* Only Dominant Profile Card */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="bg-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition">
              <CardHeader>
                <CardTitle>Profil Dominant</CardTitle>
                <CardDescription>{dominantProfile}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(scores)
                    .filter(([, score]) => score > 0)
                    .sort(([, a], [, b]) => b - a)
                    .map(([trait, score]) => (
                      <div key={trait} className="flex justify-between items-center">
                        <span>{trait}</span>
                        <span className="font-mono">{(score * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">Profil Dominant: {dominantProfile}</h2>
          </DialogContent>
        </Dialog>
      </div>
    </GradientBackground>
  );
}

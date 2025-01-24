
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
        {/* Dominant Profile Card */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="bg-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition">
              <CardHeader>
                <CardTitle>Profil Dominant</CardTitle>
                <CardDescription>{dominantProfile}</CardDescription>
              </CardHeader>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">Profil Dominant: {dominantProfile}</h2>
            {/* Add more detailed content here */}
          </DialogContent>
        </Dialog>

        {/* Sub-Profile Card */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="bg-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition">
              <CardHeader>
                <CardTitle>Sous-Profil</CardTitle>
                <CardDescription>
                  {profile} - Match: {matchPercentage}%
                </CardDescription>
              </CardHeader>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">Sous-Profil: {profile}</h2>
            <p className="text-lg">Pourcentage de correspondance: {matchPercentage}%</p>
            {/* Add more detailed content here */}
          </DialogContent>
        </Dialog>

        {/* Key Traits Card */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="bg-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition">
              <CardHeader>
                <CardTitle>Traits Principaux</CardTitle>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {sortedTraits.map(([trait, score]) => (
                      <div key={trait} className="flex justify-between items-center">
                        <span>{trait}</span>
                        <span className="font-mono">{(score * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CardHeader>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-4">Traits Principaux</h2>
            <div className="space-y-4">
              {sortedTraits.map(([trait, score]) => (
                <div key={trait} className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">{trait}</span>
                    <span className="font-mono text-lg">{(score * 100).toFixed(1)}%</span>
                  </div>
                  {/* Add more detailed content for each trait here */}
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </GradientBackground>
  );
}

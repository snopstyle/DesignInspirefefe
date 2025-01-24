
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
  const [matchPercentage, setMatchPercentage] = useState<number>(0);

  useEffect(() => {
    const answers = sessionStorage.getItem('quizAnswers');
    if (!answers) {
      setLocation('/quiz');
      return;
    }

    const calculatedScores = calculateProfileScores(JSON.parse(answers));
    const matchedProfile = getMatchedProfile(calculatedScores);
    const nonZeroScores = Object.entries(calculatedScores)
      .filter(([, score]) => score > 0)
      .sort(([, a], [, b]) => b - a);
    
    const totalScore = nonZeroScores.reduce((sum, [, score]) => sum + score, 0);
    const calculatedPercentage = Math.round((nonZeroScores[0]?.[1] || 0) / totalScore * 100);

    setProfile(matchedProfile);
    setScores(calculatedScores);
    setDominantProfile(dominant_profile_mapping[matchedProfile] || '');
    setMatchPercentage(calculatedPercentage);
  }, [setLocation]);

  if (!profile || !scores) {
    return <div>Loading...</div>;
  }

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
          </DialogContent>
        </Dialog>

        {/* Key Traits Card */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="bg-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition">
              <CardHeader>
                <CardTitle>Traits Clés</CardTitle>
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
            <h2 className="text-2xl font-bold mb-4">Traits Clés</h2>
            <div className="space-y-4">
              {Object.entries(scores)
                .filter(([, score]) => score > 0)
                .sort(([, a], [, b]) => b - a)
                .map(([trait, score]) => (
                  <div key={trait} className="flex justify-between items-center text-lg">
                    <span>{trait}</span>
                    <span className="font-mono">{(score * 100).toFixed(1)}%</span>
                  </div>
                ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </GradientBackground>
  );
}

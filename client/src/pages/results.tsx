
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { calculateProfileScores, getMatchedProfile, dominant_profile_mapping, profile_summaries } from '@/lib/profile-logic';
import { GradientBackground } from '@/components/layout/gradient-background';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function Results() {
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [dominantProfile, setDominantProfile] = useState<string>('');
  const [matchPercentage, setMatchPercentage] = useState<number>(0);

  useEffect(() => {
    const loadResults = async () => {
      const answers = sessionStorage.getItem('quizAnswers');
      if (!answers) {
        setLocation('/quiz');
        return;
      }

      // Calculer les scores de manière asynchrone
      const calculatedScores = calculateProfileScores(JSON.parse(answers));
      const matchedProfile = getMatchedProfile(calculatedScores);
      
      // Calculer le pourcentage de correspondance
      const totalPossibleScore = 5 * Object.keys(calculatedScores).length;
      const totalScore = Object.values(calculatedScores).reduce((sum, score) => sum + score, 0);
      const calculatedPercentage = Math.round((totalScore / totalPossibleScore) * 100);

      setProfile(matchedProfile);
      setScores(calculatedScores);
      setDominantProfile(dominant_profile_mapping[matchedProfile] || '');
      setMatchPercentage(calculatedPercentage);
    };

    loadResults();
    setDominantProfile(dominant_profile_mapping[matchedProfile] || '');
    setMatchPercentage(calculatedPercentage);
  }, [setLocation]);

  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  if (showLoading) {
    return (
      <GradientBackground>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingAnimation />
        </div>
      </GradientBackground>
    );
  }

  if (!dominantProfile) {
    return <div>Loading...</div>;
  }

  const profileDetails = profile_summaries[dominantProfile];

  return (
    <GradientBackground>
      <div className="container mx-auto py-8 space-y-6">
        {/* Profile Card */}
        <Card className="bg-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Profil</CardTitle>
            <CardDescription>{dominantProfile}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">{profileDetails?.description}</p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Forces</h3>
                <ul className="list-disc list-inside">
                  {profileDetails?.strengths.map((strength, i) => (
                    <li key={i}>{strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Carrières Suggérées</h3>
                <ul className="list-disc list-inside">
                  {profileDetails?.careers.map((career, i) => (
                    <li key={i}>{career}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Parcours Éducatifs Recommandés</h3>
                <ul className="list-disc list-inside">
                  {profileDetails?.education_paths.map((path, i) => (
                    <li key={i}>{path}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Compétences à Développer</h3>
                <ul className="list-disc list-inside">
                  {profileDetails?.skills_to_develop.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Traits Card */}
        <Card className="bg-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Traits Clés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(scores)
                .filter(([, score]) => score > 0)
                .sort(([, a], [, b]) => b - a)
                .map(([trait, score]) => (
                  <div key={trait} className="flex justify-between items-center p-2 bg-white/5 rounded">
                    <span>{trait}</span>
                    <div className="w-1/2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${score * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-mono w-16 text-right">{(score * 100).toFixed(1)}%</span>
                  </div>
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

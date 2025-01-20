
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { GradientBackground } from "@/components/layout/gradient-background";

export default function Results() {
  const [, setLocation] = useLocation();
  const { data: results } = useQuery({
    queryKey: ["/api/quiz/results"]
  });

  const latestResult = results?.[results.length - 1];

  if (!latestResult) {
    return (
      <GradientBackground>
        <div className="container mx-auto py-12">
          <Card className="max-w-2xl mx-auto bg-background/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl">Erreur</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">Aucun résultat trouvé. Veuillez compléter le quiz.</p>
              <Button
                onClick={() => setLocation("/")}
                className="w-full mt-6"
              >
                Retourner à l'Accueil
              </Button>
            </CardContent>
          </Card>
        </div>
      </GradientBackground>
    );
  }

  // Sort trait scores by value
  const sortedTraits = Object.entries(latestResult.psychoSocialProfile || {})
    .sort(([, a], [, b]) => (b as number) - (a as number));

  // Sort profile scores by value
  const sortedProfiles = Object.entries(latestResult.profileScores || {})
    .sort(([, a], [, b]) => (b as number) - (a as number));

  return (
    <GradientBackground>
      <div className="container mx-auto py-12">
        <Card className="max-w-4xl mx-auto bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl">Résultats de Votre Profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Profil Dominant</h2>
              <p className="text-xl">{latestResult.dominantProfile}</p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">Scores des Traits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedTraits.map(([trait, score], index) => (
                  <div key={index} className="flex justify-between items-center border-b py-2">
                    <span className="text-lg">{trait}</span>
                    <span className="font-semibold">{(score as number).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Scores des Profils</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedProfiles.map(([profile, score], index) => (
                  <div key={index} className="flex justify-between items-center border-b py-2">
                    <span className="text-lg">{profile}</span>
                    <span className="font-semibold">{(score as number).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setLocation("/")}
              className="w-full mt-6"
            >
              Refaire le Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    </GradientBackground>
  );
}

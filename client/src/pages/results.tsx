
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

  // Calcul des traits dominants (top 5)
  const dominantTraits = Object.entries(latestResult.traitScores || {})
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5);

  // Calcul des profils compatibles (>65%)
  const compatibleProfiles = Object.entries(latestResult.profileMatchScores || {})
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .filter(([, score]) => (score as number) >= 0.65);

  return (
    <GradientBackground>
      <div className="container mx-auto py-12">
        <Card className="max-w-4xl mx-auto bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl">Résultats de Votre Profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Profil Dominant */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Profil Dominant</h2>
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-xl font-semibold text-primary">{latestResult.dominantProfile}</p>
              </div>
            </div>

            {/* Traits Dominants */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Traits Dominants</h2>
              <div className="grid grid-cols-1 gap-3">
                {dominantTraits.map(([trait, score], index) => (
                  <div 
                    key={index} 
                    className="bg-secondary/10 p-4 rounded-lg flex justify-between items-center"
                  >
                    <span className="text-lg font-medium">{trait}</span>
                    <span className="text-lg font-semibold">{((score as number) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Profils Compatibles */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Profils Compatibles (&gt;65%)</h2>
              <div className="grid grid-cols-1 gap-3">
                {compatibleProfiles.map(([profile, score], index) => (
                  <div 
                    key={index} 
                    className="bg-accent/10 p-4 rounded-lg flex justify-between items-center"
                  >
                    <span className="text-lg font-medium">{profile}</span>
                    <span className="text-lg font-semibold">{((score as number) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Description du Profil</h2>
              <p className="text-lg leading-relaxed">
                Votre profil dominant est "{latestResult.dominantProfile}". 
                Ce profil se caractérise par une forte {dominantTraits[0]?.[0]} ({((dominantTraits[0]?.[1] as number) * 100).toFixed(1)}%), 
                {dominantTraits[1]?.[0]} ({((dominantTraits[1]?.[1] as number) * 100).toFixed(1)}%) 
                et {dominantTraits[2]?.[0]} ({((dominantTraits[2]?.[1] as number) * 100).toFixed(1)}%).
              </p>
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

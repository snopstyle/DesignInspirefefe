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

  return (
    <GradientBackground>
      <div className="container mx-auto py-12">
        <Card className="max-w-4xl mx-auto bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Votre Profil Personnalisé</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Profil Dominant */}
            <div className="bg-primary/10 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Profil Dominant</h2>
              <p className="text-xl font-medium text-primary">{latestResult.dominantProfile}</p>
            </div>

            {/* Sous-profil */}
            <div className="bg-secondary/10 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Sous-profil</h2>
              <p className="text-xl font-medium text-secondary">{latestResult.subProfile}</p>
            </div>

            {/* Traits Principaux */}
            <div className="bg-background/10 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Traits Principaux</h2>
              <div className="grid gap-3">
                {dominantTraits.map(([trait, score], index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center bg-white/5 p-4 rounded-lg"
                  >
                    <span className="text-lg font-medium">{trait}</span>
                    <span className="text-lg font-semibold text-primary">
                      {((score as number) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setLocation("/search")}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              En savoir plus
            </Button>
          </CardContent>
        </Card>
      </div>
    </GradientBackground>
  );
}
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { GradientBackground } from "@/components/layout/gradient-background";
import { Brain, Target, Sparkles } from "lucide-react";

export default function Results() {
  const [, setLocation] = useLocation();
  const { data: results } = useQuery({
    queryKey: ["/api/quiz/results"]
  });

  const latestResult = results?.[0];

  if (!latestResult) {
    return (
      <GradientBackground>
        <div className="container mx-auto py-12">
          <Card className="max-w-2xl mx-auto bg-transparent backdrop-blur-sm">
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

  return (
    <GradientBackground>
      <div className="container mx-auto min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-3xl bg-transparent backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Découvrez Votre Profil</CardTitle>
            <CardDescription className="text-lg text-center mt-2">
              <div className="text-white/90">
                <p className="font-medium">Voici l'analyse détaillée de vos réponses</p>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="cursor-pointer bg-white/10 hover:bg-white/15 hover:scale-[1.02] transition-all rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="w-8 h-8 text-orange-400/90" />
                  <h3 className="text-xl font-bold">PROFIL DOMINANT</h3>
                </div>
                <p className="text-white/70">{latestResult.dominantProfile}</p>
              </div>

              <div className="cursor-pointer bg-white/10 hover:bg-white/15 hover:scale-[1.02] transition-all rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-8 h-8 text-purple-400/90" />
                  <h3 className="text-xl font-bold">SOUS-PROFIL</h3>
                </div>
                <p className="text-white/70">{latestResult.subProfile}</p>
              </div>

              <div className="cursor-pointer bg-white/10 hover:bg-white/15 hover:scale-[1.02] transition-all rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-8 h-8 text-blue-400/90" />
                  <h3 className="text-xl font-bold">TRAITS PRINCIPAUX</h3>
                </div>
                <div className="space-y-2">
                  {latestResult.traits.map((trait: string, index: number) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center bg-white/5 p-3 rounded-lg"
                    >
                      <span className="text-white/70">{trait}</span>
                      <span className="text-white/90 font-medium">
                        {((latestResult.traitScores[trait] || 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={() => setLocation("/search")}
              className="w-full bg-gradient-to-r from-orange-500/80 to-purple-500/80 hover:from-orange-500 hover:to-purple-500 text-white py-6 text-lg"
            >
              Découvrir les Formations
            </Button>
          </CardContent>
        </Card>
      </div>
    </GradientBackground>
  );
}
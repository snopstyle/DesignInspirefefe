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
    return null;
  }

  return (
    <GradientBackground>
      <div className="container mx-auto py-12">
        <Card className="max-w-2xl mx-auto bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl">Your Profile Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Dominant Profile</h2>
              <p className="text-xl">{latestResult.dominantProfile}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Sub Profile</h2>
              <p className="text-xl">{latestResult.subProfile}</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Key Traits</h2>
              <ul className="list-disc list-inside space-y-2">
                {latestResult.traits.map((trait: string, index: number) => (
                  <li key={index} className="text-lg">{trait}</li>
                ))}
              </ul>
            </div>
            <Button
              onClick={() => setLocation("/")}
              className="w-full mt-6"
            >
              Take Quiz Again
            </Button>
          </CardContent>
        </Card>
      </div>
    </GradientBackground>
  );
}

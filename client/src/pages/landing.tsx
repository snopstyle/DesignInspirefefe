
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { GradientBackground } from "@/components/layout/gradient-background";
import { Card } from "@/components/ui/card";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <GradientBackground>
      <div className="container mx-auto min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-6">
          {/* Main Navigation */}
          <div className="space-y-4">
            <Button
              onClick={() => setLocation("/quiz")}
              className="w-full h-16 text-xl bg-primary hover:bg-primary/90"
            >
              Quiz d'orientation
            </Button>
            <Button
              onClick={() => setLocation("/search")}
              className="w-full h-16 text-xl bg-primary hover:bg-primary/90"
            >
              Recherche de formation
            </Button>
            <Button
              onClick={() => setLocation("/profile")}
              className="w-full h-16 text-xl bg-primary hover:bg-primary/90"
            >
              Profil
            </Button>
          </div>

          {/* Premium Section */}
          <Card className="p-6 bg-accent/10">
            <h2 className="text-2xl font-bold mb-4 text-center">Zone Premium</h2>
            <div className="space-y-4">
              <Button
                disabled
                className="w-full h-16 text-xl bg-accent/50 cursor-not-allowed"
              >
                Entretien avec un conseiller
              </Button>
              <Button
                disabled
                className="w-full h-16 text-xl bg-accent/50 cursor-not-allowed"
              >
                Service d'aide à l'inscription
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </GradientBackground>
  );
}

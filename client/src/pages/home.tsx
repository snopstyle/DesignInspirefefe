import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { GradientBackground } from "@/components/layout/gradient-background";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <GradientBackground>
      <div className="container mx-auto min-h-screen flex flex-col items-center justify-center text-white text-center">
        <h1 className="text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
          Discover Your Profile
        </h1>
        <p className="text-xl mb-12 max-w-2xl">
          Take our adaptive quiz to uncover your unique personality traits and get personalized recommendations for your career path.
        </p>
        <Button
          onClick={() => setLocation("/quiz")}
          size="lg"
          className="bg-white text-primary hover:bg-gray-100"
        >
          Start Quiz
        </Button>
      </div>
    </GradientBackground>
  );
}
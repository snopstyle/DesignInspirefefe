
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Pause, Play } from "lucide-react";

interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientBackground({ children, className }: GradientBackgroundProps) {
  const [isAnimated, setIsAnimated] = useState(true);

  return (
    <div className={cn(
      "fixed inset-0 w-full h-full bg-gradient-to-br from-orange-400/90 via-purple-500/90 to-orange-500/90",
      isAnimated && "animate-gradient",
      "overflow-hidden backdrop-blur-sm -z-10",
      className
    )}>
      <Button 
        variant="outline" 
        size="icon"
        className="absolute top-4 right-4 z-50 bg-black/20 hover:bg-black/40"
        onClick={() => setIsAnimated(!isAnimated)}
      >
        {isAnimated ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-[linear-gradient(transparent_1px,transparent_1px),linear-gradient(to_right,rgb(255_255_255/0.025)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

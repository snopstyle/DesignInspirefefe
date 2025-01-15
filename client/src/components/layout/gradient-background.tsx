import { cn } from "@/lib/utils";

interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientBackground({ children, className }: GradientBackgroundProps) {
  return (
    <div className={cn(
      "min-h-screen w-full bg-gradient-to-br from-orange-500 via-purple-500 to-blue-600",
      "animate-gradient-slow relative overflow-hidden",
      className
    )}>
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

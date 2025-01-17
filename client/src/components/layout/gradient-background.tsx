import { cn } from "@/lib/utils";

interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientBackground({ children, className }: GradientBackgroundProps) {
  return (
    <div className={cn(
      "min-h-screen w-full bg-gradient-to-br from-primary/20 via-purple-500/30 to-blue-600/20",
      "relative overflow-hidden",
      className
    )}>
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 animate-gradient" />

      {/* Glass morphism effect */}
      <div className="absolute inset-0 backdrop-blur-[2px] bg-white/5" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
import { cn } from "@/lib/utils";

interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientBackground({ children, className }: GradientBackgroundProps) {
  return (
    <div className={cn(
      "min-h-screen w-full bg-gradient-to-br from-orange-500/90 via-purple-500/90 to-purple-800/90",
      "relative overflow-hidden backdrop-blur-sm",
      className
    )}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      {/* Neo-retro grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_1px,transparent_1px),linear-gradient(to_right,rgb(255_255_255/0.025)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
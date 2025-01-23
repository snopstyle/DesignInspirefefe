import { cn } from "@/lib/utils";
import { Link } from "wouter";

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn(
      "w-full py-6 px-4 mt-auto bg-background/80 backdrop-blur-sm border-t", 
      className
    )}>
      <div className="container mx-auto">
        <div className="text-sm text-muted-foreground">
          <Link href="/about" className="hover:underline text-foreground">
            À propos
          </Link>
        </div>
      </div>
    </footer>
  );
}
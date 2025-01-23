import { cn } from "@/lib/utils";
import { Link } from "wouter";

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn(
      "w-full py-6 px-4 mt-auto bg-background border-t", 
      className
    )}>
      <div className="container mx-auto">
        <div className="text-center">
          <Link href="/about" className="text-lg font-semibold hover:underline text-foreground">
            À propos
          </Link>
        </div>
      </div>
    </footer>
  );
}
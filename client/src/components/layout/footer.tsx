
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn(
      "w-full py-6 px-4 mt-auto bg-transparent", 
      className
    )}>
      <div className="container mx-auto">
        <div className="text-left pl-4">
          <Link href="/about" className="text-sm italic hover:underline text-foreground/70">
            À propos
          </Link>
        </div>
      </div>
    </footer>
  );
}

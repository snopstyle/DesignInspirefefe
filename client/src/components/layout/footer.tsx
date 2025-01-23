import { cn } from "@/lib/utils";

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn(
      "w-full py-6 px-4 mt-auto bg-background/80 backdrop-blur-sm border-t", 
      className
    )}>
      <div className="container mx-auto">
        <div className="text-sm text-muted-foreground">
          <h3 className="font-semibold mb-2 text-foreground">À propos</h3>
          <p className="mb-2">
            HumanEdTech naît d'une conviction : la technologie doit servir l'humain, jamais l'asservir.
            Notre mission est de réinventer l'éducation à l'ère numérique.
          </p>
          <p className="mb-2">
            Notre vision : Une pédagogie augmentée, jamais diminuée. Des outils qui stimulent la curiosité
            plutôt que l'addiction, qui reconnectent les élèves à leur corps, à leur intuition, à leur désir de créer.
          </p>
          <p>
            « La technologie a rétréci le monde, mais elle ne doit pas rétrécir notre humanité. »
            — HumanEdTech
          </p>
        </div>
      </div>
    </footer>
  );
}

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";

interface FiltersProps {
  villes: string[];
  selectedVille: string;
  onVilleChange: (ville: string) => void;
  domaines: string[];
  selectedDomaines: string[];
  onDomaineToggle: (domaine: string) => void;
}

export function SearchFilters({
  villes,
  selectedVille,
  onVilleChange,
  domaines,
  selectedDomaines,
  onDomaineToggle,
}: FiltersProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Ville</h3>
        <Input
          type="search"
          placeholder="Rechercher une ville..."
          value={selectedVille}
          onChange={(e) => onVilleChange(e.target.value)}
          className="w-full"
        />
        {villes.length > 0 && (
          <ScrollArea className="h-40 mt-2 rounded-md border">
            <div className="p-2">
              {villes
                .filter(ville => 
                  ville.toLowerCase().includes(selectedVille.toLowerCase())
                )
                .map((ville) => (
                  <div
                    key={ville}
                    className="flex items-center px-2 py-1 cursor-pointer hover:bg-accent rounded"
                    onClick={() => onVilleChange(ville)}
                  >
                    {ville === selectedVille && (
                      <Check className="w-4 h-4 mr-2 text-primary" />
                    )}
                    {ville}
                  </div>
                ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Domaines</h3>
        <ScrollArea className="h-40 rounded-md border">
          <div className="p-4 flex flex-wrap gap-2">
            {domaines.map((domaine) => (
              <Badge
                key={domaine}
                variant={selectedDomaines.includes(domaine) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onDomaineToggle(domaine)}
              >
                {domaine}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
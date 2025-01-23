import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Filter,
  GraduationCap
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchFilters } from "@/components/search/filters";
import { FormationCard } from "@/components/ui/formation-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FormationResult {
  id: string;
  formation: string;
  etablissement: string;
  domaines: string[];
  ville: string;
  duree: string;
  lien?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVille, setSelectedVille] = useState("");
  const [selectedDomaines, setSelectedDomaines] = useState<string[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch cities and domains
  const { data: cities = [] } = useQuery<string[]>({
    queryKey: ['/api/cities'],
    staleTime: Infinity
  });

  const { data: domains = [] } = useQuery<string[]>({
    queryKey: ['/api/domains']
  });

  // Build search URL with params
  const buildSearchUrl = () => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) params.set('q', debouncedSearchTerm);
    if (selectedVille) params.set('ville', selectedVille);
    if (selectedDomaines.length > 0) params.set('tags', selectedDomaines.join(','));
    return `/api/search?${params.toString()}`;
  };

  // Search results query
  const { data: results = [], isLoading } = useQuery<FormationResult[]>({
    queryKey: [buildSearchUrl()],
    enabled: Boolean(debouncedSearchTerm) || Boolean(selectedVille) || selectedDomaines.length > 0
  });

  const handleDomaineToggle = (domaine: string) => {
    setSelectedDomaines(prev =>
      prev.includes(domaine)
        ? prev.filter(d => d !== domaine)
        : [...prev, domaine]
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="backdrop-blur-xl bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-3xl font-bold flex items-center gap-2">
                <GraduationCap className="h-8 w-8 text-orange-500" />
                <span className="bg-gradient-neo from-orange-500/80 to-purple-500/80 bg-clip-text text-transparent">
                  Formations & Etablissements
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: Master Finance ou IAE Bordeaux..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-white/5 border-white/10"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="gap-2 border-white/10 bg-white/5 hover:bg-white/10"
                      >
                        <Filter className="h-4 w-4" />
                        Filtres
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="backdrop-blur-xl bg-white/5 border-white/10">
                      <SearchFilters
                        villes={cities}
                        selectedVille={selectedVille}
                        onVilleChange={setSelectedVille}
                        domaines={domains}
                        selectedDomaines={selectedDomaines}
                        onDomaineToggle={handleDomaineToggle}
                      />
                    </PopoverContent>
                  </Popover>
                  <Button
                    onClick={() => {}}
                    disabled={isLoading}
                    className="bg-gradient-neo from-orange-500/80 to-purple-500/80 hover:from-orange-500 hover:to-purple-500 text-white"
                  >
                    {isLoading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="space-y-4 pb-8">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : results.length > 0 ? (
                results.map((result) => (
                  <FormationCard
                    key={result.id}
                    formation={result.formation}
                    etablissement={result.etablissement}
                    domaines={result.domaines}
                    ville={result.ville}
                    duree={result.duree}
                    officialLink={result.lien}
                    socialLinks={{
                      linkedin: result.linkedin,
                      facebook: result.facebook,
                      instagram: result.instagram
                    }}
                  />
                ))
              ) : debouncedSearchTerm || selectedVille || selectedDomaines.length > 0 ? (
                <Card className="p-8 text-center text-muted-foreground backdrop-blur-xl bg-white/5 border-white/10">
                  Aucun résultat trouvé
                </Card>
              ) : null}
            </div>
          </ScrollArea>
        </div>
      </div>
    </main>
  );
}
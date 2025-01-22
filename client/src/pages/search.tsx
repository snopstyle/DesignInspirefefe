import React, { useState } from "react";
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
  lien?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVille, setSelectedVille] = useState("");
  const [selectedDomaines, setSelectedDomaines] = useState<string[]>([]);

  // Fetch cities and domains
  const { data: cities = [] } = useQuery<string[]>({
    queryKey: ['/api/cities']
  });

  const { data: domains = [] } = useQuery<string[]>({
    queryKey: ['/api/domains']
  });

  // Search results query
  const { data: results = [], isLoading } = useQuery<FormationResult[]>({
    queryKey: ['/api/search', searchTerm, selectedVille, selectedDomaines],
    enabled: Boolean(searchTerm) || Boolean(selectedVille) || selectedDomaines.length > 0
  });

  const handleDomaineToggle = (domaine: string) => {
    setSelectedDomaines(prev =>
      prev.includes(domaine)
        ? prev.filter(d => d !== domaine)
        : [...prev, domaine]
    );
  };

  return (
    <main className="min-h-screen bg-background/50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-background/80 border-white/10 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-purple-500 flex items-center gap-2">
                <GraduationCap className="h-8 w-8" />
                Recherche de Formation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Rechercher une formation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-background/50 border-white/20"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="gap-2 hover:bg-gradient-to-r hover:from-orange-500 hover:to-purple-500 hover:text-white transition-colors"
                      >
                        <Filter className="h-4 w-4" />
                        Filtres
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-background/95 border-white/20">
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
                    className="bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 text-white transition-colors"
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
                    officialLink={result.lien}
                    socialLinks={{
                      linkedin: result.linkedin,
                      facebook: result.facebook,
                      instagram: result.instagram
                    }}
                  />
                ))
              ) : searchTerm || selectedVille || selectedDomaines.length > 0 ? (
                <Card className="p-8 text-center text-muted-foreground bg-background/80 border-white/10">
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
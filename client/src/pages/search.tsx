import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, GraduationCap, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchFilters } from "@/components/search/filters";
import { FormationCard } from "@/components/ui/formation-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

interface SerpApiResult {
  organic_results: Array<{
    title: string;
    link: string;
    snippet: string;
  }>;
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVille, setSelectedVille] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [aiEnrichment, setAiEnrichment] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: cities = [] } = useQuery<string[]>({
    queryKey: ['/api/cities'],
    staleTime: Infinity
  });

  const buildSearchUrl = () => {
    const params = new URLSearchParams();
    if (debouncedValue?.trim()) params.set('q', debouncedValue.trim());
    if (selectedVille?.trim()) params.set('ville', selectedVille.trim());
    return `/api/search?${params.toString()}`;
  };

  const buildSerpUrl = () => {
    return `/api/serp-search?q=${encodeURIComponent(debouncedValue + ' formation')}`;
  };

  const { data: localResults = [], isLoading: isLocalLoading } = useQuery<FormationResult[]>({
    queryKey: [buildSearchUrl()],
    enabled: Boolean(debouncedValue?.trim()) || Boolean(selectedVille?.trim()),
    staleTime: 1000
  });

  const { data: serpResults, isLoading: isSerpLoading } = useQuery<SerpApiResult>({
    queryKey: [buildSerpUrl()],
    enabled: Boolean(debouncedValue?.trim()) && aiEnrichment,
    staleTime: 1000
  });

  const isLoading = isLocalLoading || (aiEnrichment && isSerpLoading);

  // Combine local and SerpAPI results
  const combinedResults = React.useMemo(() => {
    const results = [...localResults];

    if (aiEnrichment && serpResults?.organic_results) {
      serpResults.organic_results.forEach((result, index) => {
        results.push({
          id: `serp-${index}`,
          formation: result.title,
          etablissement: new URL(result.link).hostname,
          domaines: [],
          ville: "External",
          duree: "N/A",
          lien: result.link
        });
      });
    }

    return results;
  }, [localResults, serpResults, aiEnrichment]);

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
                <div className="flex items-center gap-2">
                  <Switch
                    id="ai-enrichment"
                    checked={aiEnrichment}
                    onCheckedChange={setAiEnrichment}
                  />
                  <Label htmlFor="ai-enrichment" className="flex items-center gap-2 cursor-pointer">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    Enrichissement IA
                  </Label>
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
              ) : combinedResults.length > 0 ? (
                combinedResults.map((result) => (
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
              ) : debouncedValue || selectedVille ? (
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
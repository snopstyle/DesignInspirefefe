import React, { useState, useCallback } from "react";
import debounce from "lodash/debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { TagInput, type Tag } from "@/components/ui/tag-input";
import { 
  GraduationCap, 
  Search, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Clock, 
  Euro, 
  MapPin,
  Filter,
  X,
  History,
  BookOpen
} from "lucide-react";
import { GradientBackground } from "@/components/layout/gradient-background";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Tags des domaines de formation
const FORMATION_DOMAINS: Tag[] = [
  { id: "dev", label: "Développement", category: "domaine" },
  { id: "data", label: "Data Science", category: "domaine" },
  { id: "design", label: "Design", category: "domaine" },
  { id: "marketing", label: "Marketing Digital", category: "domaine" },
  { id: "business", label: "Business", category: "domaine" },
  { id: "management", label: "Management", category: "domaine" },
  { id: "communication", label: "Communication", category: "domaine" },
  { id: "langues", label: "Langues", category: "domaine" },
  { id: "sante", label: "Santé", category: "domaine" },
  { id: "art", label: "Arts & Culture", category: "domaine" }
];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Array<any>>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (!term) return;
      try {
        setIsLoading(true);
        const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
        const data = await response.json();
        setSuggestions(data.slice(0, 5));
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const handleSearch = async () => {
    if (!searchTerm && selectedTags.length === 0 && Object.keys(activeFilters).length === 0) return;

    setIsLoading(true);
    try {
      let query = searchTerm;

      // Ajouter les tags à la requête
      if (selectedTags.length > 0) {
        query += ` tags:${selectedTags.map(tag => tag.label).join(',')}`;
      }

      // Ajouter les filtres actifs
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value) query += ` ${key}:${value}`;
      });

      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
      setSuggestions([]);

      // Sauvegarder dans l'historique récent
      if (searchTerm.trim()) {
        setRecentSearches(prev => [searchTerm, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagSelect = (tag: Tag) => {
    setSelectedTags(prev => [...prev, tag]);
  };

  const handleTagRemove = (tagToRemove: Tag) => {
    setSelectedTags(prev => prev.filter(tag => tag.id !== tagToRemove.id));
  };

  const handleFilterChange = (type: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const removeFilter = (type: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[type];
    setActiveFilters(newFilters);
  };

  React.useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const SocialLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    if (!href || href === "non renseigné") return null;

    const cleanUrl = href.startsWith('http') ? href : `https://${href}`;

    return (
      <a 
        href={cleanUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-flex items-center hover:scale-110 transition-transform"
      >
        <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-secondary/80">
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </Badge>
      </a>
    );
  };

  return (
    <GradientBackground>
      <main className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <GraduationCap className="h-6 w-6" />
                Recherche de Formation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Rechercher une formation..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <Filter className="h-4 w-4" />
                          Filtres
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Durée</label>
                            <select 
                              className="w-full p-2 rounded-md border border-input bg-background"
                              onChange={(e) => handleFilterChange('durée', e.target.value)}
                              value={activeFilters['durée'] || ''}
                            >
                              <option value="">Toutes les durées</option>
                              <option value="1-3 mois">1-3 mois</option>
                              <option value="3-6 mois">3-6 mois</option>
                              <option value="6-12 mois">6-12 mois</option>
                              <option value="+12 mois">+12 mois</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Ville</label>
                            <select 
                              className="w-full p-2 rounded-md border border-input bg-background"
                              onChange={(e) => handleFilterChange('ville', e.target.value)}
                              value={activeFilters['ville'] || ''}
                            >
                              <option value="">Toutes les villes</option>
                              <option value="Paris">Paris</option>
                              <option value="Lyon">Lyon</option>
                              <option value="Marseille">Marseille</option>
                              <option value="Bordeaux">Bordeaux</option>
                              <option value="Toulouse">Toulouse</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Niveau</label>
                            <select 
                              className="w-full p-2 rounded-md border border-input bg-background"
                              onChange={(e) => handleFilterChange('niveau', e.target.value)}
                              value={activeFilters['niveau'] || ''}
                            >
                              <option value="">Tous les niveaux</option>
                              <option value="Bac+2">Bac+2</option>
                              <option value="Bac+3">Bac+3</option>
                              <option value="Bac+4">Bac+4</option>
                              <option value="Bac+5">Bac+5</option>
                            </select>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button onClick={handleSearch} disabled={isLoading}>
                      {isLoading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      ) : (
                        <Search className="h-4 w-4 mr-2" />
                      )}
                      Rechercher
                    </Button>
                  </div>

                  {/* Domaines de formation */}
                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <BookOpen className="h-4 w-4" />
                      Domaines de formation
                    </div>
                    <TagInput
                      tags={FORMATION_DOMAINS}
                      selectedTags={selectedTags}
                      onTagSelect={handleTagSelect}
                      onTagRemove={handleTagRemove}
                      placeholder="Sélectionner un domaine..."
                    />
                  </div>

                  {/* Recherches récentes */}
                  {recentSearches.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <History className="h-4 w-4" />
                        Recherches récentes
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer hover:bg-accent"
                            onClick={() => {
                              setSearchTerm(search);
                              handleSearch();
                            }}
                          >
                            {search}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Active Filters */}
                  {Object.keys(activeFilters).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {Object.entries(activeFilters).map(([type, value]) => (
                        <Badge 
                          key={type}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {type}: {value}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeFilter(type)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}

                  {suggestions.length > 0 && searchTerm && (
                    <div className="absolute z-10 w-full bg-background border rounded-md mt-1 shadow-lg">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-accent cursor-pointer"
                          onClick={() => {
                            setSearchTerm(suggestion.Formation || suggestion.name);
                            setSuggestions([]);
                            handleSearch();
                          }}
                        >
                          {suggestion.Formation || suggestion.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {results?.map((result, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{result.formation}</CardTitle>
                        <CardDescription className="text-lg font-medium">
                          {result.etablissement}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <SocialLink href={result.facebook} icon={Facebook} label="Facebook" />
                        <SocialLink href={result.instagram} icon={Instagram} label="Instagram" />
                        <SocialLink href={result.linkedin} icon={Linkedin} label="LinkedIn" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {result.duree || "Non renseigné"}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Euro className="h-4 w-4" />
                          {result.cout?.montant ? `${result.cout.montant}€` : "Non renseigné"}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {result.ville || "Non renseigné"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <p className="font-semibold">Type de formation:</p>
                          <p>{result.type || "Non renseigné"}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Niveau:</p>
                          <p>{result.niveau || "Non renseigné"}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Pédagogie:</p>
                          <p>{result.pedagogie ? 
                            Object.entries(result.pedagogie)
                              .filter(([_, value]) => value)
                              .map(([key]) => key)
                              .join(', ') 
                            : "Non renseigné"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </main>
    </GradientBackground>
  );
}
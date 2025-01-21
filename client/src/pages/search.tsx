import React, { useState, useCallback, useEffect } from "react";
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
import { useQuery } from "@tanstack/react-query";

const SocialLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
  if (!href || href === "non renseigné") return null;

  const cleanUrl = href.startsWith('http') ? href : `https://${href}`;

  const iconColors = {
    Facebook: "bg-[#1877F2] hover:bg-[#0D65D9]",
    Instagram: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90",
    Linkedin: "bg-[#0A66C2] hover:bg-[#004182]"
  };

  const iconColor = iconColors[label as keyof typeof iconColors] || "bg-gray-600 hover:bg-gray-700";

  return (
    <a
      href={cleanUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center hover:scale-110 transition-transform"
    >
      <div className={`p-2 rounded-full ${iconColor} text-white shadow-md`}>
        <Icon className="h-5 w-5" />
      </div>
    </a>
  );
};

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Array<any>>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Charger les domaines depuis l'API
  const { data: domains = [] } = useQuery({
    queryKey: ["/api/domains"],
    select: (data: string[]) =>
      data.map(domain => ({
        id: domain.toLowerCase().replace(/\s+/g, '-'),
        label: domain,
        category: "domaine"
      }))
  });

  // Charger les villes depuis l'API
  const { data: cities = [] } = useQuery({
    queryKey: ["/api/cities"]
  });

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
    setIsLoading(true);
    try {
      let queryParams = new URLSearchParams();

      // Ajouter le terme de recherche
      if (searchTerm) {
        queryParams.append('q', searchTerm);
      }

      // Ajouter les tags
      if (selectedTags.length > 0) {
        queryParams.append('tags', selectedTags.map(tag => tag.label).join(','));
      }

      // Ajouter les filtres actifs
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`/api/search?${queryParams.toString()}`);
      const data = await response.json();
      console.log('Search results:', data);
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


  return (
    <GradientBackground>
      <main className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-background/80 backdrop-blur-sm border-white/10 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-purple-500 flex items-center gap-2">
                <GraduationCap className="h-8 w-8" />
                Recherche de Formation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Rechercher une formation ou un établissement..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
                      <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Ville</label>
                            <select
                              className="w-full p-2 rounded-md border border-input bg-background"
                              onChange={(e) => handleFilterChange('ville', e.target.value)}
                              value={activeFilters['ville'] || ''}
                            >
                              <option value="">Toutes les villes</option>
                              {cities.map((city: string) => (
                                <option key={city} value={city}>
                                  {city}
                                </option>
                              ))}
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
                    <Button
                      onClick={() => {
                        handleSearch();
                        setSuggestions([]); // Clear suggestions when searching
                      }}
                      disabled={isLoading}
                      className="bg-gradient-neo from-orange-500/80 to-purple-500/80 hover:from-orange-500 hover:to-purple-500 text-white rounded-2xl"
                    >
                      {isLoading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Certification d'État */}
                  <div className="mt-4 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="diplomeEtat"
                      className="h-4 w-4 rounded border-input"
                      onChange={(e) => handleFilterChange('diplomeEtat', e.target.checked ? 'true' : '')}
                      checked={activeFilters['diplomeEtat'] === 'true'}
                    />
                    <label htmlFor="diplomeEtat" className="text-sm">
                      Uniquement les diplômes reconnus par l'État
                    </label>
                  </div>

                  {/* Domaines de formation */}
                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <BookOpen className="h-4 w-4" />
                      Domaines de formation
                    </div>
                    <TagInput
                      tags={domains}
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
              {Array.isArray(results) ? results.map((result, index) => (
                <Card key={index} className="bg-background/80 backdrop-blur-sm border-white/10 shadow-xl rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{result.formation}</CardTitle>
                        <p className="text-lg font-medium">
                          {result.etablissement}
                        </p>
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
              )) : null}
            </div>
          </ScrollArea>
        </div>
      </main>
    </GradientBackground>
  );
}
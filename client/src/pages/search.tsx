
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Search, Facebook, Instagram, Linkedin, Clock, Euro, MapPin } from "lucide-react";
import { GradientBackground } from "@/components/layout/gradient-background";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = React.useCallback(
    debounce(async (term) => {
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
    if (!searchTerm) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setResults(data);
      setSuggestions([]);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const SocialLink = ({ href, icon: Icon, label }) => {
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
          <Card>
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
                    <Button onClick={handleSearch} disabled={isLoading}>
                      {isLoading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      ) : (
                        <Search className="h-4 w-4 mr-2" />
                      )}
                      Rechercher
                    </Button>
                  </div>
                  
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
                  <Button onClick={handleSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select 
                    className="w-full p-2 rounded-md border border-input bg-background"
                    onChange={(e) => {
                      setSearchTerm(prev => prev + ` durée:${e.target.value}`);
                      handleSearch();
                    }}
                  >
                    <option value="">Filtrer par durée</option>
                    <option value="1-3 mois">1-3 mois</option>
                    <option value="3-6 mois">3-6 mois</option>
                    <option value="6-12 mois">6-12 mois</option>
                    <option value="+12 mois">+12 mois</option>
                  </select>

                  <select 
                    className="w-full p-2 rounded-md border border-input bg-background"
                    onChange={(e) => {
                      setSearchTerm(prev => prev + ` ville:${e.target.value}`);
                      handleSearch();
                    }}
                  >
                    <option value="">Filtrer par ville</option>
                    <option value="Paris">Paris</option>
                    <option value="Lyon">Lyon</option>
                    <option value="Marseille">Marseille</option>
                    <option value="Bordeaux">Bordeaux</option>
                    <option value="Toulouse">Toulouse</option>
                  </select>

                  <select 
                    className="w-full p-2 rounded-md border border-input bg-background"
                    onChange={(e) => {
                      setSearchTerm(prev => prev + ` niveau:${e.target.value}`);
                      handleSearch();
                    }}
                  >
                    <option value="">Filtrer par niveau</option>
                    <option value="Bac+2">Bac+2</option>
                    <option value="Bac+3">Bac+3</option>
                    <option value="Bac+4">Bac+4</option>
                    <option value="Bac+5">Bac+5</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {results.map((result, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">{result.Formation}</CardTitle>
                    <CardDescription className="text-lg font-medium">
                      {result["Etablissement "]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {result["Durée "] || "Non renseigné"}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Euro className="h-4 w-4" />
                          {result["Coût"] || "Non renseigné"}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {result["Ville"] || "Non renseigné"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <p className="font-semibold">Type de formation:</p>
                          <p>{result["Type Formation"] || "Non renseigné"}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Niveau:</p>
                          <p>{result["NIveau"] || "Non renseigné"}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Pédagogie:</p>
                          <p>{result["Pédagogie"] || "Non renseigné"}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {result.Facebook && <SocialLink href={result.Facebook} icon={Facebook} label="Facebook" />}
                        {result.Instagram && <SocialLink href={result.Instagram} icon={Instagram} label="Instagram" />}
                        {result.Linkedin && <SocialLink href={result.Linkedin} icon={Linkedin} label="LinkedIn" />}
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

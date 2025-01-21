
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

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const SocialLink = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => {
  if (!href || href === "non renseigné") return null;
  
  // Nettoyer l'URL si nécessaire
  const cleanUrl = href.startsWith('http') ? href : `https://${href}`;
  
  return (
    <a href={cleanUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:scale-110 transition-transform">
      <Badge variant="outline" className="gap-1 cursor-pointer bg-background/60 hover:bg-background">
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
              <div className="flex gap-2">
                <Input
                  placeholder="Rechercher une formation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
              </div>
            </CardContent>
          </Card>

          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {results.map((result, index) => (
                <Card key={index} className="overflow-hidden">
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
                          {result["Durée "]}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Euro className="h-4 w-4" />
                          {result["Coût"]}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {result["Ville"]}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <p className="font-semibold">Type de formation:</p>
                          <p>{result["Type Formation"]}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Niveau:</p>
                          <p>{result["NIveau"]}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Pédagogie:</p>
                          <p>{result["Pédagogie"]}</p>
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

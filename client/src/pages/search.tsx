
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GraduationCap, Search } from "lucide-react";
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
              <Card key={index}>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold">{result.name}</h3>
                  <p className="text-sm text-gray-500">{result.location}</p>
                  <p className="mt-2">{result.description}</p>
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

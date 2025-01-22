import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiLinkedin, SiFacebook, SiInstagram } from "react-icons/si";
import { ExternalLink } from "lucide-react";

interface FormationCardProps {
  formation: string;
  etablissement: string;
  domaines: string[];
  ville: string;
  officialLink?: string;
  socialLinks?: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
}

export function FormationCard({
  formation,
  etablissement,
  domaines,
  ville,
  officialLink,
  socialLinks
}: FormationCardProps) {
  return (
    <Card className="w-full max-w-2xl hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{formation}</CardTitle>
        <div className="text-lg text-muted-foreground">{etablissement}</div>
        <div className="text-sm text-muted-foreground">{ville}</div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {domaines.map((domaine, index) => (
            <Badge key={index} variant="secondary">
              {domaine}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center gap-4 mt-4">
          {officialLink && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(officialLink, '_blank')}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Site officiel
            </Button>
          )}
          
          <div className="flex gap-2 ml-auto">
            {socialLinks?.linkedin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(socialLinks.linkedin, '_blank')}
                className="hover:text-[#0A66C2]"
              >
                <SiLinkedin className="h-5 w-5" />
              </Button>
            )}
            
            {socialLinks?.facebook && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(socialLinks.facebook, '_blank')}
                className="hover:text-[#1877F2]"
              >
                <SiFacebook className="h-5 w-5" />
              </Button>
            )}
            
            {socialLinks?.instagram && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(socialLinks.instagram, '_blank')}
                className="hover:text-[#E4405F]"
              >
                <SiInstagram className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

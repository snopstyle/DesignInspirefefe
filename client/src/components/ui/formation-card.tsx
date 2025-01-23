import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiLinkedin, SiFacebook, SiInstagram } from "react-icons/si";
import { ExternalLink, Clock } from "lucide-react";

interface FormationCardProps {
  formation: string;
  etablissement: string;
  domaines: string[];
  ville: string;
  duree: string;
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
  duree,
  officialLink,
  socialLinks
}: FormationCardProps) {
  return (
    <Card className="w-full max-w-2xl backdrop-blur-xl bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          <span className="bg-gradient-neo from-orange-500/80 to-purple-500/80 bg-clip-text text-transparent">
            {formation}
          </span>
        </CardTitle>
        <div className="text-lg text-muted-foreground">{etablissement}</div>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span>{ville}</span>
          {duree && (
            <>
              <span className="text-muted-foreground/50">•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {duree}
              </span>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {domaines.map((domaine, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="bg-white/5 hover:bg-white/10 transition-colors border-white/10"
            >
              {domaine}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-4">
          {officialLink && officialLink !== 'Non Renseigné' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(officialLink, '_blank')}
              className="gap-2 bg-gradient-neo from-orange-500/80 to-purple-500/80 text-white border-none h-8 text-xs"
            >
              <ExternalLink className="h-3 w-3" />
              Site officiel
            </Button>
          )}

          <div className="flex gap-3 ml-auto">
            {socialLinks?.linkedin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(socialLinks.linkedin, '_blank')}
                className="h-12 w-12 hover:text-[#0A66C2] hover:bg-[#0A66C2]/10"
              >
                <SiLinkedin className="h-7 w-7" />
              </Button>
            )}

            {socialLinks?.facebook && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(socialLinks.facebook, '_blank')}
                className="h-12 w-12 hover:text-[#1877F2] hover:bg-[#1877F2]/10"
              >
                <SiFacebook className="h-7 w-7" />
              </Button>
            )}

            {socialLinks?.instagram && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(socialLinks.instagram, '_blank')}
                className="h-12 w-12 hover:text-[#E4405F] hover:bg-[#E4405F]/10"
              >
                <SiInstagram className="h-7 w-7" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
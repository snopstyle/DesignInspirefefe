
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { GradientBackground } from "@/components/layout/gradient-background";

export default function StatsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <GradientBackground>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Statistiques des Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>Formations: {stats?.formations[0]?.count || 0}</div>
              <div>Établissements: {stats?.establishments[0]?.count || 0}</div>
              <div>Localisations: {stats?.locations[0]?.count || 0}</div>
              <div>Coûts: {stats?.costs[0]?.count || 0}</div>
              <div>Types de Pédagogie: {stats?.pedagogy_types[0]?.count || 0}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GradientBackground>
  );
}

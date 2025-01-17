import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { Loader2, ClipboardList, UserCircle, Brain, BookOpen, School } from "lucide-react";
import { useLocation } from "wouter";

export default function ProfilePage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: completion, isLoading, error } = useQuery({
    queryKey: ["/api/profile/completion"],
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load profile completion status"
    });
  }

  const sections = [
    {
      title: "Basic Information",
      description: "Your personal details and preferences",
      icon: UserCircle,
      completed: completion?.basicInfoCompleted,
      path: "/basic-info"
    },
    {
      title: "Traits Assessment",
      description: "Understand your key personality traits",
      icon: Brain,
      completed: completion?.traitsAssessmentCompleted,
      path: "/traits-assessment"
    },
    {
      title: "Personality Quiz",
      description: "Discover your personality type",
      icon: ClipboardList,
      completed: completion?.personalityQuizCompleted,
      path: "/quiz"
    },
    {
      title: "Interests & Passions",
      description: "What drives and motivates you",
      icon: BookOpen,
      completed: completion?.interestsCompleted,
      path: "/interests"
    },
    {
      title: "Education Preferences",
      description: "Your ideal learning environment",
      icon: School,
      completed: completion?.educationPrefsCompleted,
      path: "/education-preferences"
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Profile Completion</h1>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{completion?.overallProgress || 0}%</span>
            </div>
            <Progress value={completion?.overallProgress || 0} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                  <section.icon className="h-6 w-6 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  variant={section.completed ? "secondary" : "default"}
                  className="w-full"
                  onClick={() => setLocation(section.path)}
                >
                  {section.completed ? "Update" : "Complete"} Section
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

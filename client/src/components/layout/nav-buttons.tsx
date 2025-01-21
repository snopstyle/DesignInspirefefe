
import { useLocation } from "wouter";
import { useUser } from "@/hooks/use-user";
import { Home, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";

export function NavButtons() {
  const [, setLocation] = useLocation();
  const { logout } = useUser();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="fixed top-4 left-4 flex gap-2 z-50">
      <Card 
        className="w-12 h-12 flex items-center justify-center cursor-pointer bg-background/80 backdrop-blur-sm hover:bg-accent transition-colors"
        onClick={() => setLocation("/")}
      >
        <Home className="h-5 w-5" />
      </Card>
      <Card 
        className="w-12 h-12 flex items-center justify-center cursor-pointer bg-background/80 backdrop-blur-sm hover:bg-accent transition-colors"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5" />
      </Card>
    </div>
  );
}

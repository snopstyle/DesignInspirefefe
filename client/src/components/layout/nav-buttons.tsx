
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useUser } from "@/hooks/use-user";
import { Home, LogOut } from "lucide-react";

export function NavButtons() {
  const [, setLocation] = useLocation();
  const { logout } = useUser();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="fixed top-4 left-4 flex gap-2 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setLocation("/")}
        className="bg-background/80 backdrop-blur-sm"
      >
        <Home className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleLogout}
        className="bg-background/80 backdrop-blur-sm"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}

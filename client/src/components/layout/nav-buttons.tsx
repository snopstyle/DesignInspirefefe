
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
    <div className="fixed top-6 left-6 flex gap-3 z-[100]">
      <Card 
        className="w-10 h-10 flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
        onClick={() => setLocation("/")}
      >
        <Home className="h-4 w-4 text-white" />
      </Card>
      <Card 
        className="w-10 h-10 flex items-center justify-center cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 text-white" />
      </Card>
    </div>
  );
}

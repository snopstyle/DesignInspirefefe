import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Quiz from "@/pages/quiz";
import Results from "@/pages/results";
import AuthPage from "@/pages/auth-page";
import Profile from "@/pages/profile";
import { useUser } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";
import { NavButtons } from "@/components/layout/nav-buttons";
import SearchPage from './pages/search';
import Landing from "@/pages/landing";

function AuthenticatedRoutes() {
  return (
    <>
      <NavButtons />
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/welcome" component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/quiz" component={Quiz} />
        <Route path="/results" component={Results} />
        <Route path="/profile" component={Profile} />
        <Route path="/search" component={SearchPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function Router() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <AuthenticatedRoutes />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
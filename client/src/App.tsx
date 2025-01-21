import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import Landing from "@/pages/landing";
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

  return (
    <>
      <NavButtons />
      <Switch>
        <Route path="/" element={<Landing />} />
        <Route path="/welcome" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/results" element={<Results />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<SearchPage />} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
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
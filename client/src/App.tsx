import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Quiz from "@/pages/quiz";
import Results from "@/pages/results";
import Profile from "@/pages/profile";
import { NavButtons } from "@/components/layout/nav-buttons";
import SearchPage from './pages/search';
import Landing from "@/pages/landing";
import Stats from "./pages/stats";
import { ThemeProvider } from "@/lib/theme";
import { ThemeToggle } from "@/components/theme-toggle";

function Router() {
  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <NavButtons />
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/quiz" component={Quiz} />
        <Route path="/results" component={Results} />
        <Route path="/profile" component={Profile} />
        <Route path="/search" component={SearchPage} />
        <Route path="/auth" component={Landing} />
        <Route path="/stats" component={Stats} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
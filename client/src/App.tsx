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
import Welcome from "@/pages/welcome";
import Chat from "@/pages/chat";
import { Layout } from "@/components/layout/layout";
import About from "@/pages/about";

function Router() {
  return (
    <Layout>
      <NavButtons />
      <Switch>
        <Route path="/" component={Welcome} />
        <Route path="/landing" component={Landing} />
        <Route path="/quiz" component={Quiz} />
        <Route path="/results" component={Results} />
        <Route path="/profile" component={Profile} />
        <Route path="/search" component={SearchPage} />
        <Route path="/auth" component={Landing} />
        <Route path="/stats" component={Stats} />
        <Route path="/chat" component={Chat} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/use-user";
import { GradientBackground } from "@/components/layout/gradient-background";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FcGoogle } from "react-icons/fc";

export default function AuthPage() {
  const { login, register } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: { username: string; password: string }, mode: 'login' | 'register') => {
    try {
      setIsLoading(true);
      if (mode === 'register') {
        await register(data);
      } else {
        await login(data);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <GradientBackground>
      <div className="container relative min-h-screen flex items-center justify-center py-20">
        <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
          <CardHeader className="space-y-2 text-center pb-8">
            <CardTitle className="text-3xl font-bold tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 h-11">
                <TabsTrigger value="login" className="text-sm font-medium">Login</TabsTrigger>
                <TabsTrigger value="register" className="text-sm font-medium">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => onSubmit(data, 'login'))} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Username</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="h-11 bg-white/5 border-white/10 focus:border-white/20 focus:bg-white/10"
                              placeholder="Enter your username"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              {...field} 
                              className="h-11 bg-white/5 border-white/10 focus:border-white/20 focus:bg-white/10"
                              placeholder="Enter your password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full h-11 font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => onSubmit(data, 'register'))} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Username</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="h-11 bg-white/5 border-white/10 focus:border-white/20 focus:bg-white/10"
                              placeholder="Choose a username"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              {...field} 
                              className="h-11 bg-white/5 border-white/10 focus:border-white/20 focus:bg-white/10"
                              placeholder="Create a password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full h-11 font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background/80 px-2 text-muted-foreground backdrop-blur-sm">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button 
                variant="outline" 
                type="button" 
                className="w-full h-11 font-medium bg-white/5 border-white/10 hover:bg-white/10"
                onClick={handleGoogleLogin}
              >
                <FcGoogle className="mr-2 h-5 w-5" />
                Google
              </Button>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </GradientBackground>
  );
}
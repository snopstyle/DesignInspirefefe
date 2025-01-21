
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/use-user";
import { GradientBackground } from "@/components/layout/gradient-background";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";

export default function AuthPage() {
  const { login, register } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const form = useForm({
    defaultValues: {
      username: "",
      email: "", 
      password: "",
    },
  });

  const onSubmit = async (data: { username: string; password: string }) => {
    try {
      if (isLogin) {
        await login(data);
      } else {
        await register(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <GradientBackground>
      <div className="container max-w-lg mx-auto min-h-screen flex items-center">
        <Card className="w-full bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{isLogin ? "Connexion" : "Inscription"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <Button 
                variant={isLogin ? "default" : "outline"}
                onClick={() => setIsLogin(true)}
                className="w-full"
              >
                Connexion
              </Button>
              <Button 
                variant={!isLogin ? "default" : "outline"}
                onClick={() => setIsLogin(false)}
                className="w-full"
              >
                Inscription
              </Button>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom d'utilisateur</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!isLogin && (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {isLogin ? "Se connecter" : "S'inscrire"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </GradientBackground>
  );
}

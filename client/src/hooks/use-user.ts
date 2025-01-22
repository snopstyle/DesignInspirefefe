import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { InsertUser, User } from "@db/schema";
import { useToast } from "./use-toast";

type RequestResult = {
  ok: true;
  message?: string;
} | {
  ok: false;
  message: string;
};

async function handleAuthRequest(
  url: string,
  method: string,
  body?: InsertUser
): Promise<RequestResult> {
  try {
    const response = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status >= 500) {
        return { ok: false, message: response.statusText };
      }

      const message = await response.text();
      return { ok: false, message };
    }

    const data = await response.json();
    return { ok: true, message: data.message };

  } catch (e: any) {
    return { ok: false, message: e.toString() };
  }
}

async function fetchUser(): Promise<User | null> {
  const response = await fetch('/api/user', {
    credentials: 'include'
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Vérifier s'il y a un utilisateur temporaire
      const tempUser = sessionStorage.getItem('tempUser');
      if (tempUser) {
        return JSON.parse(tempUser);
      }

      // Créer un nouvel utilisateur temporaire
      const tempResponse = await fetch('/api/temp-user', {
        method: 'POST',
        credentials: 'include'
      });

      if (tempResponse.ok) {
        const tempUserData = await tempResponse.json();
        sessionStorage.setItem('tempUser', JSON.stringify(tempUserData));
        return tempUserData;
      }

      return null;
    }

    if (response.status >= 500) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    throw new Error(`${response.status}: ${await response.text()}`);
  }

  const user = await response.json();
  if (user.isTemporary) {
    sessionStorage.setItem('tempUser', JSON.stringify(user));
  } else if (sessionStorage.getItem('tempUser')) {
    const tempUser = JSON.parse(sessionStorage.getItem('tempUser')!);
    sessionStorage.removeItem('tempUser');
    try {
      // Fusionner les données du quiz et le profil
      await Promise.all([
        fetch('/api/quiz/merge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tempUserId: tempUser.id }),
          credentials: 'include'
        }),
        fetch('/api/profile/merge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tempUserId: tempUser.id }),
          credentials: 'include'
        })
      ]);
    } catch (error) {
      console.error('Erreur lors de la fusion des données:', error);
    }
  }
  return user;
}

export function useUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: user, error, isLoading } = useQuery<User | null, Error>({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: Infinity,
    retry: false
  });

  const loginMutation = useMutation<RequestResult, Error, InsertUser>({
    mutationFn: (userData) => handleAuthRequest('/api/login', 'POST', userData),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({
        title: "Success",
        description: result.message || "Logged in successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const logoutMutation = useMutation<RequestResult, Error>({
    mutationFn: () => handleAuthRequest('/api/logout', 'POST'),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({
        title: "Success",
        description: result.message || "Logged out successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const registerMutation = useMutation<RequestResult, Error, InsertUser>({
    mutationFn: (userData) => handleAuthRequest('/api/register', 'POST', userData),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({
        title: "Success",
        description: result.message || "Registration successful",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    isAuthenticating: loginMutation.isPending || registerMutation.isPending,
  };
}
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from "./use-toast";

type TempUser = {
  id: string;
};

type RequestResult = {
  ok: true;
  message?: string;
  id?: string;
} | {
  ok: false;
  message: string;
};

async function handleAuthRequest(
  url: string,
  method: string,
  body?: { username?: string }
): Promise<RequestResult> {
  try {
    const response = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return { ok: false, message: data.message || response.statusText };
    }

    return { ok: true, id: data.id, message: data.message };
  } catch (e: any) {
    return { ok: false, message: e.toString() };
  }
}

async function fetchUserStatus(): Promise<{ isAuthenticated: boolean; id?: string }> {
  try {
    const response = await fetch('/api/users/verify', {
      credentials: 'include'
    });

    if (!response.ok) {
      return { isAuthenticated: false };
    }

    const data = await response.json();
    return { 
      isAuthenticated: data.valid,
      id: data.id
    };
  } catch (error) {
    console.error('Error fetching user status:', error);
    return { isAuthenticated: false };
  }
}

export function useUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: userStatus, error, isLoading } = useQuery({
    queryKey: ['user-status'],
    queryFn: fetchUserStatus,
    staleTime: Infinity,
    retry: false
  });

  const createTempUser = useMutation({
    mutationFn: async (username: string) => {
      const result = await handleAuthRequest('/api/users/temp', 'POST', { username });
      if (!result.ok) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user-status'], { 
        isAuthenticated: true,
        id: data.id
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    isAuthenticated: userStatus?.isAuthenticated ?? false,
    userId: userStatus?.id,
    isLoading,
    error,
    createTempUser
  };
}
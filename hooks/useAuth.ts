"use client";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function useAuth() {
  const { data: session, isPending } = authClient.useSession();

  const login = async (provider: string) => {
    try {
      await authClient.signIn.social({
        provider: provider as "github",
        callbackURL: "/",
      });
    } catch {
      toast.error("Erreur lors de la connexion");
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut();
      toast.success("Déconnecté");
    } catch {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return {
    session,
    status: isPending
      ? "loading"
      : session
        ? "authenticated"
        : "unauthenticated",
    isLoading: isPending,
    login,
    logout,
    isAuthenticated: !!session,
  };
}

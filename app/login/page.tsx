"use client";
import { supabase } from "@/lib/supabase";
import { Github } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Si déjà connecté, redirige
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const callbackUrl =
          searchParams.get("callbackUrl") || "/admin/dashboard";
        console.log("⏩ Redirection vers:", callbackUrl);
        router.replace(callbackUrl);
      }
    });
  }, [router, searchParams]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?callbackUrl=${
            searchParams.get("callbackUrl") || "/admin/dashboard"
          }`,
        },
      });

      if (error) {
        toast.error(`Erreur d'authentification: ${error.message}`);
        console.error("Erreur d'authentification:", error);
      }
    } catch (err) {
      console.error("Erreur lors de la connexion:", err);
      toast.error("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Espace Admin</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Connectez-vous pour accéder à l'espace d'administration
          </p>
        </div>

        <button
          className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white py-3 px-4 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <Github className="h-5 w-5" />
          )}
          {isLoading ? "Connexion en cours..." : "Se connecter avec GitHub"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { Github } from "lucide-react";
import { toast } from "sonner";

export default function SignInPage() {
  const handleGitHubSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      });
    } catch {
      toast.error("Erreur lors de la connexion avec GitHub");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Connexion</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte pour accéder à l&apos;administration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGitHubSignIn}
            className="w-full"
            variant="outline"
          >
            <Github className="mr-2 h-4 w-4" />
            Se connecter avec GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

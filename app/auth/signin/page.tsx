"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Github } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-sm space-y-6 p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Connexion</h1>
          <p className="text-muted-foreground">
            Connectez-vous pour accéder à l&apos;administration
          </p>
        </div>
        <Button
          className="w-full"
          onClick={() => signIn("github", { callbackUrl: "/admin/dashboard" })}
        >
          <Github className="mr-2 h-4 w-4" />
          Connexion avec GitHub
        </Button>
      </div>
    </div>
  );
}

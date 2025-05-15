"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-sm space-y-6 p-6 text-center">
        <h1 className="text-3xl font-bold text-destructive">
          Erreur d&apos;authentification
        </h1>
        <p className="text-muted-foreground">
          Une erreur est survenue lors de la connexion. Veuillez réessayer.
        </p>
        <Button asChild>
          <Link href="/auth/signin">Retour à la connexion</Link>
        </Button>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Logo from "./Logo";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-foreground/80 hover:text-primary">
              Accueil
            </Link>
            <ThemeSwitcher />
          </nav>

          {status === "authenticated" && (
            <div className="flex items-center gap-2">
              <Link
                href="/admin/dashboard"
                className="text-foreground/80 hover:text-primary font-medium"
              >
                Admin
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  await signOut({ callbackUrl: "/" });
                  toast.success("Déconnecté");
                  // Nettoyage manuel des cookies résiduels (côté client)
                  document.cookie =
                    "__Secure-next-auth.session-token=; Max-Age=0; path=/";
                  document.cookie =
                    "__Host-next-auth.csrf-token=; Max-Age=0; path=/";
                  document.cookie =
                    "__Secure-next-auth.callback-url=; Max-Age=0; path=/";

                  localStorage.removeItem("nextauth.message");
                  localStorage.removeItem("next-auth.session-token");
                  localStorage.clear();

                  // Recharge forcée de la page
                  window.location.href = "/";
                }}
                title="Se déconnecter"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
  const { status, logout } = useAuth();

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
                onClick={logout}
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

"use client";

import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Logo from "./Logo";
import ThemeSwitcher from "./ThemeSwitcher";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function AdminLink() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (!session?.user || session.user.role !== "ADMIN") return null;

  return (
    <Link
      href="/admin/dashboard"
      className="text-foreground/80 hover:text-primary font-medium"
    >
      Admin
    </Link>
  );
}

function LogoutButton() {
  const { status } = useSession();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    await signOut();
  };

  if (status !== "authenticated") return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleSignOut}
      title="Se déconnecter"
    >
      <LogOut className="h-5 w-5" />
    </Button>
  );
}

export default function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-foreground/80 hover:text-primary">
              Accueil
            </Link>
            <AdminLink />
          </nav>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { createBrowserClient } from "@supabase/ssr";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Logo from "./Logo";
import ThemeSwitcher from "./ThemeSwitcher";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function AdminLink() {
  const session = useSession();
  if (!session?.user) return null;
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
  const session = useSession();
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Déconnecté");
    window.location.reload();
  };
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

function LoginButton() {
  const session = useSession();
  const router = useRouter();
  if (session) return null;
  return (
    <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
      Se connecter
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
            <LoginButton />
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}

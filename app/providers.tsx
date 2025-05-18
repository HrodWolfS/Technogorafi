"use client";

import { supabase } from "@/lib/supabase";
import { SessionContextProvider as SupabaseSessionProvider } from "@supabase/auth-helpers-react";
import { SessionProvider } from "next-auth/react";
import type { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <SupabaseSessionProvider supabaseClient={supabase}>
        {children}
      </SupabaseSessionProvider>
    </SessionProvider>
  );
}

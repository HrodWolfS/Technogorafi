"use client";

import { supabase } from "@/lib/supabase";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import type { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  );
}

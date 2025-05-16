import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const callbackUrl =
    requestUrl.searchParams.get("callbackUrl") || "/admin/dashboard";

  console.log(
    "🔄 Callback Auth avec code:",
    !!code,
    "redirect vers:",
    callbackUrl
  );

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Rediriger vers l'URL de callback ou l'admin par défaut
  return NextResponse.redirect(new URL(callbackUrl, requestUrl.origin));
}

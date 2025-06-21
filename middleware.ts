import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*"],
};

export async function middleware(request: NextRequest) {
  // Le nom du cookie est `better-auth.session_token`
  const sessionTokenCookie = request.cookies.get("better-auth.session_token");

  console.log(
    '🔍 Middleware - Cookie de session "better-auth.session_token" trouvé:',
    !!sessionTokenCookie
  );

  if (!sessionTokenCookie) {
    console.log(
      "❌ Middleware - Pas de cookie de session, redirection vers signin"
    );
    const url = new URL("/auth/signin", request.url);
    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  console.log("✅ Middleware - Session valide, accès autorisé");
  return NextResponse.next();
}

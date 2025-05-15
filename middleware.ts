import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("🔒 Middleware démarré pour:", request.url);

  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    });

    console.log("🚀 Token dans middleware:", {
      tokenExists: !!token,
      email: token?.email,
      role: token?.role,
      name: token?.name,
      sub: token?.sub,
      isAdmin: token?.role === "ADMIN",
      allCookies: request.cookies.getAll().map((c) => c.name),
    });

    // Si pas de token ou pas de rôle admin, rediriger vers la page de connexion
    if (!token || token.role !== "ADMIN") {
      console.log(
        "⛔ Accès refusé:",
        !token ? "Pas de token" : `Rôle ${token.role} n'est pas ADMIN`
      );
      const url = new URL("/auth/signin", request.url);
      url.searchParams.set("callbackUrl", "/admin/dashboard");
      return NextResponse.redirect(url);
    }

    console.log("✅ Accès autorisé pour ADMIN");
    return NextResponse.next();
  } catch (error) {
    console.error("❌ Erreur dans le middleware:", error);
    const url = new URL("/auth/signin", request.url);
    url.searchParams.set("callbackUrl", "/admin/dashboard");
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};

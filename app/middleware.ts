import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("🔒 Middleware démarré pour:", request.url);

  try {
    // Crée un client Supabase avec les cookies de la requête
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });

    // Vérifier si l'utilisateur est authentifié
    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log("🚀 Session Supabase dans middleware:", {
      sessionExists: !!session,
      email: session?.user?.email,
      userId: session?.user?.id,
    });

    // Si pas de session, rediriger vers la page de connexion
    if (!session) {
      console.log("⛔ Accès refusé: Pas de session Supabase");
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", "/admin/dashboard");
      return NextResponse.redirect(url);
    }

    // Vérifier si l'utilisateur a le rôle admin (à adapter selon votre structure de données)
    // Cet exemple suppose que vous avez un champ user_metadata avec un rôle
    const userRole = session.user.user_metadata?.role;

    // Si besoin de vérifier d'autres conditions (comme le rôle)
    // if (userRole !== 'admin') {
    //   console.log("⛔ Accès refusé: L'utilisateur n'est pas admin");
    //   return NextResponse.redirect(new URL('/', request.url));
    // }

    console.log("✅ Accès autorisé pour l'utilisateur:", session.user.email);
    return res;
  } catch (error) {
    console.error("❌ Erreur dans le middleware:", error);
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", "/admin/dashboard");
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};

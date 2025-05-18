import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// En-têtes CORS pour les routes API sécurisées
const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL || "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

// Handler OPTIONS pour les requêtes preflight CORS
export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        tags: true,
        category: true,
      },
    });

    if (!article) {
      return new NextResponse("Article non trouvé", { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("[ARTICLE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("[🔧 PATCH /api/articles/[id]] appelé");

    // Vérification de session avec journalisation pour debug
    const session = await getServerSession(authOptions);
    console.log("Session détectée:", !!session, "User:", session?.user?.email);

    if (!session?.user) {
      console.log("⚠️ ERREUR AUTH: Session invalide ou manquante");
      // Renvoyer la réponse avec les en-têtes CORS
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: corsHeaders,
      });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      title,
      excerpt,
      content,
      status,
      image,
      categoryId,
      tagIds,
      scheduledAt,
    } = body;

    console.log("🕓 PATCH payload:", {
      title,
      excerpt,
      content,
      status,
      image,
      categoryId,
      tagIds,
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
    });

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        excerpt,
        content,
        status,
        image,
        updatedAt: new Date(),
        ...(status === "PUBLISHED"
          ? { publishedAt: new Date() }
          : { publishedAt: null }), // Réinitialiser publishedAt quand on n'est pas en PUBLISHED
        ...(status === "SCHEDULED" && scheduledAt
          ? {
              scheduledAt,
              publishedAt: null, // Réinitialiser publishedAt pour les articles planifiés
            }
          : { scheduledAt: null }), // Réinitialiser scheduledAt quand le statut n'est pas SCHEDULED
        category: categoryId
          ? {
              connect: { id: categoryId },
            }
          : undefined,
        tags: tagIds
          ? {
              set: tagIds.map((tagId: string) => ({ id: tagId })),
            }
          : undefined,
      },
      include: {
        tags: true,
        category: true,
      },
    });

    // Ajouter les en-têtes CORS à la réponse
    return NextResponse.json(article, { headers: corsHeaders });
  } catch (error) {
    console.error(
      "[ARTICLE_PATCH]",
      error instanceof Error ? error.message : error
    );
    console.error(
      "[ARTICLE_PATCH - STACK]",
      error instanceof Error ? error.stack : error
    );
    // Ajouter les en-têtes CORS même en cas d'erreur
    return new NextResponse("Erreur serveur: PATCH", {
      status: 500,
      headers: corsHeaders,
    });
  }
}

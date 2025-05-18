import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

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
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
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
        ...(status === "PUBLISHED" ? { publishedAt: new Date() } : {}),
        ...(status === "SCHEDULED" && scheduledAt
          ? {
              scheduledAt,
              publishedAt: null, // Réinitialiser publishedAt pour les articles planifiés
            }
          : {}),
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

    return NextResponse.json(article);
  } catch (error) {
    console.error(
      "[ARTICLE_PATCH]",
      error instanceof Error ? error.message : error
    );
    console.error(
      "[ARTICLE_PATCH - STACK]",
      error instanceof Error ? error.stack : error
    );
    return new NextResponse("Erreur serveur: PATCH", { status: 500 });
  }
}

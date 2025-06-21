export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

const viewSchema = z.object({
  articleSlug: z.string(),
});

// Fonction pour hasher l'IP
function hashIP(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

// Fonction pour vérifier si l'utilisateur peut voir l'article (anti-spam)
async function canViewArticle(
  articleId: string,
  ipHash: string
): Promise<boolean> {
  const lastView = await prisma.view.findFirst({
    where: {
      articleId,
      ipHash,
      createdAt: {
        // Une vue par IP toutes les 30 minutes
        gte: new Date(Date.now() - 30 * 60 * 1000),
      },
    },
  });

  return !lastView;
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { articleSlug } = viewSchema.parse(json);

    // Récupérer l'article
    const article = await prisma.article.findUnique({
      where: { slug: articleSlug },
      select: { id: true },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Récupérer et hasher l'IP
    const headers = new Headers(request.headers);
    const ip =
      headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "anonymous";
    const ipHash = hashIP(ip);

    // Vérifier si l'utilisateur peut voir l'article
    const canView = await canViewArticle(article.id, ipHash);
    if (!canView) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    // Créer la vue
    await prisma.view.create({
      data: {
        articleId: article.id,
        ipHash,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", issues: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating view:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

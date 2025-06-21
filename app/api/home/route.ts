export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    // Récupérer les articles publiés avec la catégorie sélectionnée
    const articles = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: {
          lte: new Date(),
        },
        ...(category
          ? {
              category: {
                name: category,
              },
            }
          : {}),
      },
      include: {
        category: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
    });

    // Récupérer les catégories uniques
    const categories = await prisma.category.findMany({
      where: {
        articles: {
          some: {
            status: "PUBLISHED",
          },
        },
      },
    });

    return NextResponse.json({ articles, categories });
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    );
  }
}

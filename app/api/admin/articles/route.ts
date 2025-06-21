export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        excerpt: true,
        status: true,
        createdAt: true,
        scheduledAt: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Erreur lors de la récupération des articles:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des articles" },
      { status: 500 }
    );
  }
}

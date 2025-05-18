import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("[CRON] Fonction /api/cron/publish-scheduled appelée");

  // Vérification de l'authentification Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    console.error("[CRON] Erreur d'authentification");
    return NextResponse.json(
      { success: false, error: "Non autorisé" },
      { status: 401 }
    );
  }

  try {
    // Mise à jour des articles planifiés dont la date est passée
    const result = await prisma.article.updateMany({
      where: {
        status: "SCHEDULED",
        scheduledAt: {
          lte: new Date(),
        },
      },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });

    console.log(`[CRON] ${result.count} article(s) publiés`);

    return NextResponse.json(
      {
        success: true,
        count: result.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Erreur lors de la publication des articles planifiés :",
      error
    );
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

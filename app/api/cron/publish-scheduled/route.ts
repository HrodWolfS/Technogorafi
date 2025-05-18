import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await prisma.article.updateMany({
      where: {
        status: "SCHEDULED",
        publishedAt: {
          lte: new Date(),
        },
      },
      data: {
        status: "PUBLISHED",
      },
    });

    return NextResponse.json({
      message: "Articles mis à jour",
      count: result.count,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la publication des articles planifiés :",
      error
    );
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}

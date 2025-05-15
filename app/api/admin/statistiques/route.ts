import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, subDays } from "date-fns";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type DailyView = {
  date: Date;
  views: bigint;
};

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7";
    const days = parseInt(period);

    const now = new Date();
    const startDate = startOfDay(subDays(now, days));

    const [totalViews, weeklyViews, monthlyViews, dailyViews, topArticles] =
      await Promise.all([
        // Total des vues
        prisma.view.count(),

        // Vues de la semaine
        prisma.view.count({
          where: {
            createdAt: {
              gte: subDays(now, 7),
            },
          },
        }),

        // Vues du mois
        prisma.view.count({
          where: {
            createdAt: {
              gte: subDays(now, 30),
            },
          },
        }),

        // Vues par jour
        prisma.$queryRaw<DailyView[]>`
          SELECT 
            DATE("createdAt") as date,
            COUNT(*) as views
          FROM "View"
          WHERE "createdAt" >= ${startDate}
          GROUP BY DATE("createdAt")
          ORDER BY date ASC
        `,

        // Top 5 des articles
        prisma.article.findMany({
          select: {
            id: true,
            title: true,
            _count: {
              select: { views: true },
            },
          },
          orderBy: {
            views: {
              _count: "desc",
            },
          },
          take: 5,
        }),
      ]);

    // Formater les données pour le graphique
    const formattedDailyViews = Array.from({ length: days }).map((_, i) => {
      const date = startOfDay(subDays(now, days - 1 - i));
      const dayViews = dailyViews.find((d) => {
        const viewDate = new Date(d.date);
        return (
          viewDate.getFullYear() === date.getFullYear() &&
          viewDate.getMonth() === date.getMonth() &&
          viewDate.getDate() === date.getDate()
        );
      });
      return {
        date: date.toISOString(),
        views: dayViews ? Number(dayViews.views) : 0,
      };
    });

    return NextResponse.json({
      totalViews,
      weeklyViews,
      monthlyViews,
      dailyViews: formattedDailyViews,
      topArticles: topArticles.map((article) => ({
        id: article.id,
        title: article.title,
        views: article._count.views,
      })),
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

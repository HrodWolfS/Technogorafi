export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const [
    totalArticles,
    totalViews,
    totalComments,
    totalCategories,
    totalTags,
    recentViews,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.view.count(),
    prisma.comment.count(),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.view.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        article: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    }),
  ]);

  return NextResponse.json({
    totalArticles,
    totalViews,
    totalComments,
    totalCategories,
    totalTags,
    recentViews,
  });
}

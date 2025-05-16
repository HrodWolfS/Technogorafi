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
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, excerpt, content, status, image, categoryId, tagIds } = body;

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        excerpt,
        content,
        status,
        image,
        updatedAt: new Date(),
        publishedAt: status === "PUBLISHED" ? new Date() : null,
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
    console.error("[ARTICLE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

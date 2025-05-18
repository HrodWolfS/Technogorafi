import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { z } from "zod";

const articleSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]),
  image: z.string().nullable(),
  categoryId: z.string().nullable(),
  tagIds: z.array(z.string()).optional(),
  scheduledAt: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
});

type Status = "DRAFT" | "PUBLISHED" | "SCHEDULED";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const validatedData = articleSchema.parse(json);
    const {
      title,
      excerpt,
      content,
      status,
      image,
      categoryId,
      tagIds,
      scheduledAt,
      publishedAt,
    } = validatedData;

    const slug = slugify(title, { lower: true, strict: true });

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        status,
        image,
        categoryId,
        scheduledAt: status === "SCHEDULED" ? scheduledAt : null,
        publishedAt: status === "PUBLISHED" ? publishedAt || new Date() : null,
        tags: tagIds?.length
          ? {
              connect: tagIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", issues: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryStatus = searchParams.get("status");
    const session = await getServerSession(authOptions);

    const where = {
      ...(queryStatus && queryStatus !== "all"
        ? { status: queryStatus as Status }
        : {}),
      ...(session?.user?.role !== "ADMIN"
        ? { status: "PUBLISHED" as Status, publishedAt: { lte: new Date() } }
        : {}),
    };

    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { comments: true },
        },
      },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("[ARTICLES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    console.log("[🔧 PATCH /api/articles/] appelé");
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { id, ...data } = body;

    const article = await prisma.article.update({
      where: { id },
      data: {
        ...data,
        status: data.status as Status,
        publishedAt:
          data.status === "PUBLISHED" && !data.publishedAt
            ? new Date()
            : data.publishedAt,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("[ARTICLES_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Missing id", { status: 400 });
    }

    await prisma.article.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ARTICLES_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

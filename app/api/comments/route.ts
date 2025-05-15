import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const commentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  content: z.string().min(10),
  articleId: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received comment data:", body);

    const data = commentSchema.parse(body);
    console.log("Validated data:", data);

    const comment = await prisma.comment.create({
      data: {
        ...data,
        approved: false,
      },
    });
    console.log("Created comment:", comment);

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Erreur lors de la création du commentaire" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const comments = await prisma.comment.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        article: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("[COMMENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

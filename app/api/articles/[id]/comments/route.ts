export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const commentSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email(),
  content: z.string().min(1, "Le contenu est requis"),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comments = await prisma.comment.findMany({
      where: {
        articleId: id,
        approved: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("[COMMENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = commentSchema.parse(body);

    const comment = await prisma.comment.create({
      data: {
        ...validatedData,
        articleId: id,
        approved: false,
      },
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid comment data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("[COMMENTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const tagSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

export async function GET() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          articles: true,
        },
      },
    },
  });
  return NextResponse.json(tags);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const tag = await prisma.tag.create({
    data: {
      name: body.name,
      slug: body.slug,
    },
    include: {
      _count: {
        select: {
          articles: true,
        },
      },
    },
  });

  return NextResponse.json(tag);
}

export async function PUT(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await request.json();
    const { id, ...data } = json;
    const validatedData = tagSchema.parse(data);

    const existingTag = await prisma.tag.findFirst({
      where: {
        OR: [{ name: validatedData.name }, { slug: validatedData.slug }],
        NOT: { id },
      },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: "Un tag avec ce nom ou ce slug existe déjà" },
        { status: 400 }
      );
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: validatedData,
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", issues: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating tag:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const tag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    await prisma.tag.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

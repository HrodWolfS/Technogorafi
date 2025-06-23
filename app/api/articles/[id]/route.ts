export const runtime = "nodejs";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// En-têtes CORS pour les routes API sécurisées
const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL || "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

// Handler OPTIONS pour les requêtes preflight CORS
export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return new NextResponse("Article ID is required", { status: 400 });
  }

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      category: true,
      tags: true,
      _count: {
        select: { comments: true, views: true },
      },
    },
  });

  if (!article) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.json(article);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return new NextResponse("Article ID is required", { status: 400 });
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();

  const articleToUpdate = await prisma.article.findUnique({
    where: { id },
  });

  if (!articleToUpdate) {
    return new NextResponse("Article not found", { status: 404 });
  }

  const data: any = {
    title: body.title,
    slug: body.slug,
    excerpt: body.excerpt,
    content: body.content,
    image: body.image,
    status: body.status,
    categoryId: body.categoryId,
    tags: {
      set: body.tagIds ? body.tagIds.map((id: string) => ({ id })) : [],
    },
  };

  // Gérer les transitions de statut
  if (body.status !== articleToUpdate.status) {
    switch (body.status) {
      case "PUBLISHED":
        data.publishedAt = new Date();
        data.scheduledAt = null;
        break;
      case "SCHEDULED":
        data.scheduledAt = body.scheduledAt
          ? new Date(body.scheduledAt)
          : new Date();
        data.publishedAt = null;
        break;
      case "DRAFT":
        data.publishedAt = null;
        data.scheduledAt = null;
        break;
    }
  }

  const article = await prisma.article.update({
    where: { id },
    data,
  });

  return NextResponse.json(article);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return new NextResponse("Article ID is required", { status: 400 });
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await prisma.article.delete({
    where: { id },
  });

  return new NextResponse(null, { status: 204 });
}

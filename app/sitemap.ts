import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Récupère tous les articles publiés
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  // URLs statiques
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: "https://technogorafi.vercel.app",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://technogorafi.vercel.app/articles",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // URLs des articles
  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `https://technogorafi.vercel.app/articles/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticUrls, ...articleUrls];
}

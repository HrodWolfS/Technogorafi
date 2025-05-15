import { prisma } from "@/lib/prisma";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Search } from "@/components/Search";
import { Suspense } from "react";
import type { PageParams } from "@/types/next";

export default async function HomePage({ searchParams }: PageParams) {
  const category = typeof searchParams.category === "string" ? searchParams.category : "";

  // Récupérer les articles publiés avec la catégorie sélectionnée
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: {
        lte: new Date(),
      },
      ...(category
        ? {
            category: {
              name: category,
            },
          }
        : {}),
    },
    include: {
      category: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  // Récupérer les catégories uniques
  const categories = await prisma.category.findMany({
    where: {
      articles: {
        some: {
          status: "PUBLISHED",
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Search articles={articles} />
        <Suspense>
          <CategoryFilter categories={categories} />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

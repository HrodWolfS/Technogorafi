import { ArticleCard } from "@/components/ArticleCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Search } from "@/components/Search";
import type { Article, Category } from "@/lib/generated/prisma";
import type { PageParams } from "@/types/next";
import { Suspense } from "react";

export default async function HomePage({ searchParams }: PageParams) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : "";

  // Récupérer les données via l'API route
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/home?category=${category}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des données");
  }

  const { articles, categories }: { articles: Article[], categories: Category[] } = await response.json();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Search articles={articles} />
        <Suspense>
          <CategoryFilter categories={categories} />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article: Article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

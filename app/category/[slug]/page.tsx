import { ArticleCard } from "@/components/ArticleCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { PageParams } from "@/types/next";

export default async function CategoryPage({ params }: PageParams<{ slug: string }>) {
  const category = decodeURIComponent(params.slug);
  
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: {
        lte: new Date(),
      },
      category: {
        name: {
          equals: category,
          mode: "insensitive",
        },
      },
    },
    include: {
      category: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">
          Catégorie: {category}
        </h1>
        <Link
          href="/"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">
          Aucun article dans cette catégorie pour le moment.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

// Fonction pour générer les paramètres statiques
export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    where: {
      articles: {
        some: {
          status: "PUBLISHED",
          publishedAt: {
            lte: new Date(),
          },
        },
      },
    },
  });

  return categories.map((category) => ({
    slug: category.name.toLowerCase(),
  }));
}

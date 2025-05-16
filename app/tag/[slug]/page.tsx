import { ArticleCard } from "@/components/ArticleCard";
import { prisma } from "@/lib/prisma";
import type { PageParams } from "@/types/next";
import Link from "next/link";

export default async function TagPage({
  params,
}: PageParams<{ slug: string }>) {
  const tag = decodeURIComponent(params.slug);

  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: {
        lte: new Date(),
      },
      tags: {
        some: {
          name: {
            equals: tag,
            mode: "insensitive",
          },
        },
      },
    },
    include: {
      tags: true,
      category: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  console.log(`Trouvé ${articles.length} articles pour le tag "${tag}"`);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Tag: #{tag}</h1>
        <Link
          href="/"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">
          Aucun article avec ce tag pour le moment.
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
  const tags = await prisma.tag.findMany({
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

  return tags.map((tag) => ({
    slug: tag.name.toLowerCase(),
  }));
}

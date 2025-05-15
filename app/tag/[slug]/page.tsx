import ArticleCard from "@/components/ArticleCard";
import { getAllArticles } from "@/lib/cache";
import Link from "next/link";

interface TagPageProps {
  params: {
    slug: string;
  };
}

// Fonction pour générer les paramètres statiques
export async function generateStaticParams() {
  const articles = getAllArticles();
  const tags = new Set<string>();

  articles.forEach((article) => {
    if (article.tags && Array.isArray(article.tags)) {
      article.tags.forEach((tag) => tags.add(tag.toLowerCase()));
    }
  });

  return Array.from(tags).map((tag) => ({
    slug: tag,
  }));
}

export default function TagPage({ params }: TagPageProps) {
  const tag = decodeURIComponent(params.slug);
  const articles = getAllArticles().filter((article) =>
    article.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
  );

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
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

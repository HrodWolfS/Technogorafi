import { Article } from "@prisma/client";
import Link from "next/link";

type RelatedArticlesProps = {
  currentSlug: string;
  articles: Article[];
};

export function RelatedArticles({
  currentSlug,
  articles,
}: RelatedArticlesProps) {
  const relatedArticles = articles
    .filter((article) => article.slug !== currentSlug)
    .slice(0, 3);

  if (relatedArticles.length === 0) return null;

  return (
    <div className="mt-12 border-t border-border pt-6">
      <div className="flex items-center gap-2">
        <div className="text-orange-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold">Articles similaires</h2>
      </div>

      <div className="my-4 space-y-3">
        {relatedArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/article/${article.slug}`}
            className="block hover:bg-background/50 -mx-2 px-2 py-1 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2 border p-2 rounded-lg hover:bg-primary/20 transition-colors">
              <div className="text-orange-500">→</div>
              <span className="text-foreground hover:text-orange-500 transition-colors">
                {article.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

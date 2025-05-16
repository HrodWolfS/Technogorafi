"use client";

type SimilarArticlesProps = {
  articles: Array<{
    title: string;
    slug: string;
  }>;
};

export function SimilarArticles({ articles }: SimilarArticlesProps) {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z" />
          <path d="M6 11c1.5 0 3 .5 3 2-2 0-3 0-3-2Z" />
          <path d="M18 11c-1.5 0-3 .5-3 2 2 0 3 0 3-2Z" />
        </svg>
        <h2 className="text-xl font-bold text-white">Articles similaires</h2>
      </div>
      <div className="flex flex-col gap-2">
        {articles.map((article) => (
          <a
            key={article.slug}
            href={`/article/${article.slug}`}
            className="block p-4 rounded-lg bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors"
          >
            {article.title}
          </a>
        ))}
      </div>
    </div>
  );
}

"use client";

import type { FC } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import { ArticleCard } from "./ArticleCard";
import type { Article } from "@/lib/generated/prisma";

type SearchProps = {
  articles: Article[];
};

export const Search: FC<SearchProps> = ({ articles }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const search = () => {
      setIsSearching(true);
      const results = articles.filter((article) => {
        const searchContent =
          `${article.title} ${article.excerpt} ${article.content}`.toLowerCase();
        return searchContent.includes(debouncedQuery.toLowerCase());
      });
      setSearchResults(results);
      setIsSearching(false);
    };

    if (debouncedQuery.trim()) {
      search();
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery, articles]);

  return (
    <div className="mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher un article..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 pr-10 border border-border rounded-lg bg-card"
        />
        {isSearching ? (
          <div className="absolute right-3 top-3">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : query ? (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        ) : null}
      </div>

      {debouncedQuery.trim() && (
        <div className="mt-4">
          {searchResults.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              Aucun résultat pour &quot;{debouncedQuery}&quot;
            </p>
          ) : (
            <>
              <p className="mb-4 text-muted-foreground">
                {searchResults.length} article
                {searchResults.length > 1 ? "s" : ""} trouvé
                {searchResults.length > 1 ? "s" : ""}
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

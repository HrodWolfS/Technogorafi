import type { Article, Category } from "@/lib/generated/prisma";
import { calculateReadingTime } from "@/lib/readingTime";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { CategoryBadge } from "./CategoryBadge";

type Props = {
  article: Article & {
    category?: Category | null;
  };
};

export const ArticleCard: FC<Props> = ({ article }) => {
  return (
    <Link href={`/article/${article.slug}`} className="block h-full">
      <div className="flex flex-col h-full rounded-lg overflow-hidden bg-card text-card-foreground border border-border hover:border-accent transition-transform duration-300 hover:scale-105">
        {article.image && (
          <div className="relative w-full aspect-[16/9]">
            <Image
              src={article.image}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority
              unoptimized={article.image.startsWith("http")}
            />
            {article.category && (
              <div className="absolute top-2 left-2">
                <CategoryBadge name={article.category.name} />
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col flex-1 p-4">
          <h2 className="text-xl font-bold mb-2 font-ibm-plex text-primary hover:text-primary/90">
            {article.title}
          </h2>
          <p className="text-sm text-muted-foreground mb-2">
            {article.publishedAt
              ? new Date(article.publishedAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : new Date(article.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
            • {calculateReadingTime(article.content)}
          </p>
          <p className="text-foreground/90 flex-1">{article.excerpt}</p>
        </div>
      </div>
    </Link>
  );
};

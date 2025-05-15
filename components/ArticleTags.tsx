import Link from "next/link";

interface ArticleTagsProps {
  categories?: string[];
  tags?: string[];
  size?: "sm" | "md";
}

export default function ArticleTags({
  categories = [],
  tags = [],
  size = "md",
}: ArticleTagsProps) {
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {categories.map((category) => (
        <Link
          key={`category-${category}`}
          href={`/category/${encodeURIComponent(category.toLowerCase())}`}
          className={`${textSize} px-2 py-1 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors`}
        >
          {category}
        </Link>
      ))}

      {tags.map((tag) => (
        <Link
          key={`tag-${tag}`}
          href={`/tag/${encodeURIComponent(tag.toLowerCase())}`}
          className={`${textSize} px-2 py-1 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors`}
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}

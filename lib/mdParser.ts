import fs from "fs";
import matter from "gray-matter";
import path from "path";

export interface Article {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image?: string;
  categories?: string[];
  tags?: string[];
  category?: string;
  content: string;
}

const contentDirectory = path.join(process.cwd(), "content");

export function getAllArticles(): Article[] {
  try {
    if (!fs.existsSync(contentDirectory)) {
      fs.mkdirSync(contentDirectory, { recursive: true });
      return [];
    }

    const files = fs.readdirSync(contentDirectory);
    return files
      .filter((filename) => filename.endsWith(".md"))
      .map((filename) => {
        const filePath = path.join(contentDirectory, filename);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(fileContent);

        return {
          slug: filename.replace(".md", ""),
          content,
          ...(data as Omit<Article, "slug" | "content">),
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Error reading articles:", error);
    return [];
  }
}

export function getArticleBySlug(slug: string): Article | null {
  try {
    const filePath = path.join(contentDirectory, `${slug}.md`);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      content,
      ...(data as Omit<Article, "slug" | "content">),
    };
  } catch {
    return null;
  }
}

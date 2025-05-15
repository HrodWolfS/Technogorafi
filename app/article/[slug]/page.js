import ArticleTags from "@/components/ArticleTags";
import Comments from "@/components/Comments";
import { RelatedArticles } from "@/components/RelatedArticles";
import ScrollToTop from "@/components/ScrollToTop";
import { generateMetadata as generateSEOMetadata } from "@/components/SEO";
import { ShareArticle } from "@/components/ShareArticle";
import TableOfContents from "@/components/TableOfContents";
import { prisma } from "@/lib/prisma";
import { calculateReadingTime } from "@/lib/readingTime";
import Image from "next/image";
import { notFound } from "next/navigation";
import Script from "next/script";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ViewTracker } from "./components/ViewTracker";

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: {
        lte: new Date(),
      },
    },
    select: {
      slug: true,
    },
  });
  return articles.map((article) => ({
    slug: String(article.slug),
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  if (!slug) return null;

  const article = await prisma.article.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      publishedAt: {
        lte: new Date(),
      },
    },
  });

  if (!article) return null;

  const imageUrl = article.image?.startsWith("http")
    ? article.image
    : `${process.env.NEXT_PUBLIC_URL}${article.image}`;

  return generateSEOMetadata({
    title: `${article.title} | TechnoGorafi`,
    description:
      article.excerpt.length > 150
        ? article.excerpt.slice(0, 150) + "..."
        : article.excerpt,
    image: imageUrl,
    type: "article",
    path: `/article/${slug}`,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      authors: ["TechnoGorafi"],
      tags: article.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@technogorafi",
    },
  });
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;

  if (!slug) {
    notFound();
    return null;
  }

  const article = await prisma.article.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      publishedAt: {
        lte: new Date(),
      },
    },
  });

  if (!article) {
    notFound();
    return null;
  }

  const url = `${process.env.NEXT_PUBLIC_URL}/article/${slug}`;

  const relatedArticles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: {
        lte: new Date(),
      },
      NOT: {
        slug,
      },
    },
    take: 3,
    orderBy: {
      publishedAt: "desc",
    },
  });

  return (
    <div className="relative max-w-6xl mx-auto">
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt,
            image: article.image,
            datePublished: article.publishedAt?.toISOString(),
            author: {
              "@type": "Person",
              name: "TechnoGorafi",
            },
            publisher: {
              "@type": "Organization",
              name: "TechnoGorafi",
              logo: {
                "@type": "ImageObject",
                url: `${process.env.NEXT_PUBLIC_URL}/favicon.svg`,
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": url,
            },
          }),
        }}
      />

      <div className="space-y-8">
        <ViewTracker slug={slug} />
        <div className="space-y-4">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_250px] lg:gap-8">
            <article className="max-w-2xl mx-auto lg:mx-0">
              <h1 className="text-4xl font-bold mb-2 font-ibm-plex text-primary leading-tight">
                {article.title}
              </h1>
              <p className="text-muted-foreground mb-4">
                {article.publishedAt?.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                • {calculateReadingTime(article.content)}
              </p>

              {(article.categories?.length || article.tags?.length) && (
                <div className="mb-8">
                  <ArticleTags
                    categories={article.categories}
                    tags={article.tags}
                  />
                </div>
              )}

              {article.image && (
                <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <div className="prose dark:prose-invert prose-primary leading-relaxed">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    img: ({ src, alt }) => {
                      const imageSrc = src?.startsWith("/")
                        ? src
                        : src?.startsWith("http")
                        ? src
                        : `/${src}`;

                      return (
                        <div className="relative aspect-video my-8">
                          <Image
                            src={imageSrc || ""}
                            alt={alt || "Image d'article"}
                            fill
                            className="object-cover rounded-lg"
                            priority
                            sizes="(max-width: 768px) 100vw, 700px"
                          />
                        </div>
                      );
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary pl-4 italic text-lg text-foreground dark:text-muted-foreground">
                        {children}
                      </blockquote>
                    ),
                    ul: ({ children }) => (
                      <ul className="pl-6 space-y-2 list-disc list-inside marker:text-primary text-foreground dark:text-muted-foreground">
                        {children}
                      </ul>
                    ),
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </div>

              <ShareArticle url={url} title={article.title} />

              <RelatedArticles currentSlug={slug} articles={relatedArticles} />

              <Comments articleId={article.id} />
            </article>

            <aside className="hidden lg:block">
              <TableOfContents />
            </aside>
          </div>

          <ScrollToTop />
        </div>
      </div>
    </div>
  );
}

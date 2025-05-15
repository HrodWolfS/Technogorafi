import { defaultSEO } from "@/lib/seo";
import { Metadata } from "next";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
  path?: string;
  openGraph?: any;
  twitter?: any;
}

export function generateMetadata({
  title,
  description,
  image,
  type = "website",
  path = "",
  openGraph,
  twitter,
}: SEOProps): Metadata {
  const url = `${process.env.NEXT_PUBLIC_URL}${path}`;
  const imageUrl = image?.startsWith("http")
    ? image
    : `${process.env.NEXT_PUBLIC_URL}${image}`;
  const fullTitle = title ? `${title} - ${defaultSEO.title}` : defaultSEO.title;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Humain Décevant",
      images: [{ url: imageUrl }],
      type: type || "website",
      locale: "fr_FR",
      ...openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      ...twitter,
    },
  };
}

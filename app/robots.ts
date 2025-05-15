import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/*",
          "/admin/*",
          "/_next/*",
          "/*.json",
          "/private/*",
          "/auth/*",
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
      {
        userAgent: "CCBot",
        disallow: ["/"],
      },
    ],
    host: "https://technogorafi.vercel.app",
    sitemap: "https://technogorafi.vercel.app/sitemap.xml",
  };
}

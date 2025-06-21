/** @type {import('next').NextConfig} */
const nextConfig = {
  // Désactiver l'export statique pour le moment
  // output: "export",
  images: {
    // Utiliser next/image optimisé
    unoptimized: false,
    // Ajouter les domaines externes autorisés si nécessaire
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    domains: ["supabase.co", "avatars.githubusercontent.com"],
  },
  // Désactive TOUTES les vérifications
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Nécessaire pour next-sitemap
  env: {
    NEXT_PUBLIC_URL:
      process.env.NEXT_PUBLIC_URL || "https://technogorafi.vercel.app",
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
};

module.exports = nextConfig;

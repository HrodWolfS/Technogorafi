declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_URL?: string;
    }
  }
}

export const defaultSEO = {
  title: "TechnoGorafi - Toute la tech. Aucun effort de vérification.",
  description: "Le premier site d'actualités tech 100% absurde et satirique.",
  url: process.env.NEXT_PUBLIC_URL || "https://technogorafi.vercel.app",
  image: "/images/preview.jpg",
  twitterHandle: "@technogorafi",
};

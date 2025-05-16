import {
  Article,
  getAllArticles as getAllArticlesFromDisk,
  getArticleBySlug as getArticleBySlugFromDisk,
} from "./mdParser";

interface Cache {
  articles: Article[] | null;
  articlesBySlug: Record<string, Article>;
  lastUpdated: number;
}

const CACHE_DURATION = 60 * 60 * 1000; // 1 heure en millisecondes

const cache: Cache = {
  articles: null,
  articlesBySlug: {},
  lastUpdated: 0,
};

/**
 * Vérifie si le cache est encore valide
 */
function isCacheValid(): boolean {
  const now = Date.now();
  return cache.lastUpdated > 0 && now - cache.lastUpdated < CACHE_DURATION;
}

/**
 * Réinitialise le cache en lisant les articles depuis le disque
 */
function refreshCache(): void {
  const now = Date.now();
  const articles = getAllArticlesFromDisk().map((article) => ({
    ...article,
    tags: article.tags || [],
    category: article.category || undefined,
  }));

  cache.articles = articles;
  cache.articlesBySlug = {};

  // Créer un index pour accéder rapidement aux articles par slug
  articles.forEach((article) => {
    cache.articlesBySlug[article.slug] = article;
  });

  cache.lastUpdated = now;
}

/**
 * Obtient tous les articles avec mise en cache
 */
export function getAllArticles(): Article[] {
  if (!isCacheValid()) {
    refreshCache();
  }

  return cache.articles || [];
}

/**
 * Obtient un article par son slug avec mise en cache
 */
export function getArticleBySlug(slug: string): Article | null {
  if (!isCacheValid()) {
    refreshCache();
  }

  // Vérifier d'abord dans le cache
  if (cache.articlesBySlug[slug]) {
    return cache.articlesBySlug[slug];
  }

  // Si non trouvé dans le cache, essayer de lire depuis le disque
  // (au cas où un nouvel article aurait été ajouté après le dernier refresh)
  const article = getArticleBySlugFromDisk(slug);

  if (article) {
    // Mettre à jour le cache
    cache.articlesBySlug[slug] = article;

    // Si la liste d'articles est déjà en cache, l'ajouter aussi
    if (cache.articles) {
      const exists = cache.articles.some((a) => a.slug === slug);
      if (!exists) {
        cache.articles.push(article);
        // Trier à nouveau les articles par date
        cache.articles.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      }
    }
  }

  return article;
}

/**
 * Force le rafraîchissement du cache
 */
export function invalidateCache(): void {
  cache.lastUpdated = 0;
}

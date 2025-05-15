"use client";

import { useEffect } from "react";

export function ViewTracker({ slug }) {
  useEffect(() => {
    fetch("/api/view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ articleSlug: slug }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          // Si c'est une erreur de rate limit, on l'ignore silencieusement
          if (res.status === 429) {
            return;
          }
          throw new Error(data.error || "Failed to register view");
        }
        return res.json();
      })
      .catch((error) => {
        console.error("Error registering view:", error);
        // Ne pas afficher d'erreur à l'utilisateur pour les statistiques
      });
  }, [slug]);

  return null;
}

"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const { theme } = useTheme();

  useEffect(() => {
    // Fonction pour extraire les titres de l'article
    const extractHeadings = () => {
      const articleContent = document.querySelector(".prose");
      if (!articleContent) return [];

      // Sélectionnez les titres h2 et h3 dans le contenu de l'article
      const headingElements = Array.from(
        articleContent.querySelectorAll("h2, h3")
      ) as HTMLHeadingElement[];

      // Pour chaque titre, assurez-vous qu'il a un id
      headingElements.forEach((heading, index) => {
        if (!heading.id) {
          const id = `heading-${index}`;
          heading.id = id;
        }
      });

      // Convertir les éléments en objets pour l'état
      return headingElements.map((heading) => ({
        id: heading.id,
        text: heading.textContent || "",
        level: heading.tagName === "H2" ? 2 : 3,
      }));
    };

    // Initialiser les titres
    setHeadings(extractHeadings());

    // Observer les changements pour le scrollspy
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    // Observer tous les titres pour le scrollspy
    document.querySelectorAll(".prose h2, .prose h3").forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  if (headings.length === 0) return null;

  return (
    <div
      className={`bg-card border border-border rounded-lg p-4 sticky top-4 max-h-[calc(100vh-6rem)] overflow-auto ${
        theme === "dark" ? "bg-opacity-90" : "bg-opacity-95"
      }`}
    >
      <h4 className="font-bold text-lg mb-3">Sommaire</h4>
      <nav>
        <ul className="space-y-1">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={`${heading.level === 3 ? "pl-4" : ""}`}
            >
              <a
                href={`#${heading.id}`}
                className={`block py-1 hover:text-primary transition-colors ${
                  activeId === heading.id
                    ? "text-primary font-medium"
                    : "text-foreground/80"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

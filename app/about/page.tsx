import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos - TechnoGorafi",
  description: "Découvrez l'histoire de Luc RAM, fondateur de TechnoGorafi",
};

export default function AboutPage() {
  return (
    <article className="prose dark:prose-invert max-w-prose mx-auto p-6">
      <h1>À propos</h1>

      <p className="lead">
        Luc RAM est un développeur fullstack junior mais vif. Ancien technicien
        réseau reconverti après avoir rêvé en JSON, il écrit aujourd'hui des
        articles absurdes sur la tech dans un style aussi acide qu'un câble RJ45
        mâché.
      </p>

      <h2>Parcours</h2>
      <ul>
        <li>2021 : découvre Git, pense que c'est un client de messagerie.</li>
        <li>2022 : apprend React, mais refuse les hooks "par principe".</li>
        <li>
          2023 : fonde TechnoGorafi pour libérer la parole absurde dans un monde
          trop normé.
        </li>
      </ul>

      <blockquote>
        <p>Je déploie, donc je suis.</p>
        <footer>— Citation favorite</footer>
      </blockquote>
    </article>
  );
}

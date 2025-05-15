# Humain Décevant - Blog

Blog personnel créé avec Next.js, TypeScript, Tailwind CSS, et Supabase.

## 🚀 Installation

1. Cloner le repo

```bash
git clone https://github.com/HrodWolfS/Blog.git
cd Blog
```

2. Installer les dépendances

```bash
pnpm install
```

3. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Remplir les variables dans `.env` avec vos valeurs

4. Configurer la base de données

```bash
pnpm dlx prisma db push
```

5. Démarrer le serveur de développement

```bash
pnpm dev
```

## 🛠️ Stack Technique

- **Framework**: Next.js 14 avec App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **Auth**: BetterAuth
- **Markdown**: react-markdown + remark-gfm
- **Hosting**: Vercel
- **Storage**: Supabase Storage

## 📁 Structure du Projet

```
├── app/                  # Routes Next.js
│   ├── (admin)/         # Routes admin protégées
│   ├── (public)/        # Routes publiques
│   └── api/             # Routes API
├── components/          # Composants React
├── lib/                 # Utilitaires et configurations
├── prisma/             # Schéma et migrations DB
└── public/             # Assets statiques
```

## 🔐 Authentification

L'authentification est gérée via BetterAuth avec GitHub OAuth. Seul l'administrateur (email configuré dans `ADMIN_EMAIL`) peut accéder au dashboard admin.

## 📝 Création d'Articles

Les articles sont écrits en Markdown avec support pour :

- Syntaxe GFM (GitHub Flavored Markdown)
- Upload d'images (drag & drop)
- Preview en temps réel
- Brouillons et programmation

## 🌐 Déploiement

1. Créer un projet sur Vercel
2. Connecter le repo GitHub
3. Configurer les variables d'environnement
4. Déployer !

## 📄 License

MIT

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# Technogorafi

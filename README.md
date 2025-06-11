# 📰 Technogorafi

> **Le Gorafi de la tech** – Un terrain de jeu pour tester (et montrer) mes skills.  
> **Objectif :** Impressionner les recruteurs & collègues.  
> **Utilité réelle :** Aucune.

---

## ✨ Pourquoi ce repo existe ?

1. **Démo full‑stack** Next.js 14 + Supabase + NextAuth.
2. **Exercice de style** : articles absurdes, administration du blog, planning auto.
3. **Terrain de bidouilles** : cron jobs, markdown, upload, RLS… tout y passe.

---

## 🎒 Installation (5 commandes)

```bash
git clone https://github.com/HrodWolfS/Technogorafi.git
cd Technogorafi
pnpm install
cp .env.example .env         # remplis tes clés Supabase / GitHub
pnpm dlx prisma db push
pnpm dev
```

Tu as maintenant un faux Gorafi tech qui tourne en local.

---

## 🏗 Stack express

| Bloc  | Tech                             | Pourquoi                      |
| ----- | -------------------------------- | ----------------------------- |
| Front | **Next.js 14** (App Router)      | SSR + RSC + SEO 👍            |
| Back  | **Prisma** + Supabase            | Postgres managé, RLS, storage |
| Auth  | **NextAuth** (GitHub + Supabase) | OAuth simple                  |
| UI    | Tailwind + shadcn/ui             | Rapidité & composabilité      |
| Cron  | **cron-job.org**                 | Publication automatique       |
| MD    | react-markdown + remark-gfm      | Écriture vitesse lumière      |

---

## 🖋 Fonctionnalités clés

- **Éditeur Markdown** avec preview live
- **Upload d’images** (bucket Supabase)
- **Tags à la volée** & catégories dynamiques
- **Statuts** : Brouillon / Publié / Planifié
- **Cron auto‑publication** (toutes les heures)
- **Dashboard admin** protégé (NextAuth)

---

## 🔁 Route cron

```http
POST /api/cron/publish-scheduled
Header: Authorization: Bearer $CRON_SECRET
```

Publie chaque article `SCHEDULED` dont la date est atteinte.

---

## 🌳 Arborescence (TL;DR)

```
app/         # Routes + API Next.js
components/  # UI réutilisable
lib/         # Helpers auth, supabase, SEO
prisma/      # Schéma DB
public/      # Assets statiques
cron/        # Scripts & route cron
```

---

## 💡 Road‑map

- [ ] Changer l'authentification pour BetterAuth
- [ ] Flux RSS absurde
- [ ] Multi‑admin (si quelqu’un est assez fou pour contribuer)

---

## 📝 Licence

MIT – Utilise, clé USB, fork… Tant que tu gardes le troll 🧌

---

_Made by Rodolphe – technicien telecom → dev web, curieux sceptique, un brin sarcastique._

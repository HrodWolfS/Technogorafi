import { PrismaClient, Role } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Supprime tous les utilisateurs existants pour éviter les doublons
  await prisma.user.deleteMany({});

  // Crée un utilisateur admin
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "stempfel.rodolphe@gmail.com", // Email de l'administrateur défini dans .env
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });

  console.log("Seed terminé. Utilisateur admin créé:", admin);
}

main()
  .catch((e) => {
    console.error("Erreur lors du seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

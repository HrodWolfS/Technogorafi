import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Nettoyage de la base de données...");
  // On supprime les comptes d'abord à cause de la clé étrangère
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("La base de données a été nettoyée.");
}

main()
  .catch((e) => {
    console.error("Erreur lors du nettoyage de la base de données:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import fs from "fs";
import { glob } from "glob";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

// Obtenir le chemin du répertoire courant en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Chemin des dossiers d'images
const sourceDir = path.join(rootDir, "public/images/originals");
const targetDir = path.join(rootDir, "public/images");

// Créer les répertoires si nécessaire
if (!fs.existsSync(sourceDir)) {
  fs.mkdirSync(sourceDir, { recursive: true });
}

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Tailles d'images à générer
const sizes = [
  { width: 640, suffix: "sm" }, // Pour mobile
  { width: 1024, suffix: "md" }, // Pour tablette
  { width: 1920, suffix: "lg" }, // Pour desktop
];

// Qualité de compression WebP
const quality = 80;

/**
 * Optimise une image et génère plusieurs tailles
 */
async function optimizeImage(inputPath) {
  try {
    const filename = path.basename(inputPath, path.extname(inputPath));
    console.log(`Optimisation de ${filename}...`);

    // Version WebP à taille originale
    await sharp(inputPath)
      .webp({ quality })
      .toFile(path.join(targetDir, `${filename}.webp`));

    // Générer les différentes tailles
    for (const size of sizes) {
      await sharp(inputPath)
        .resize({ width: size.width, withoutEnlargement: true })
        .webp({ quality })
        .toFile(path.join(targetDir, `${filename}-${size.suffix}.webp`));
    }

    console.log(`✅ ${filename} optimisé avec succès`);
  } catch (error) {
    console.error(`❌ Erreur lors de l'optimisation: ${error.message}`);
  }
}

/**
 * Traite toutes les images dans le dossier source
 */
async function processAllImages() {
  const imageFiles = await glob(`${sourceDir}/**/*.{jpg,jpeg,png}`);

  if (imageFiles.length === 0) {
    console.log("Aucune image trouvée dans le dossier source.");
    return;
  }

  console.log(`Traitement de ${imageFiles.length} images...`);

  // Traiter chaque image
  for (const imagePath of imageFiles) {
    await optimizeImage(imagePath);
  }

  console.log("✨ Optimisation terminée!");
}

// Exécuter le script
processAllImages();

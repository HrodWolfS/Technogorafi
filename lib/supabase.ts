"use client";

import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Extraction de l'ID du projet à partir de l'URL Supabase
const supabaseProjectId = supabaseUrl.match(/https:\/\/([^.]+)/)?.[1] || "";

export async function uploadImage(file: File) {
  try {
    // Forcer l'authentification anonyme si pas de session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // Connexion anonyme pour le développement
      console.log("🔑 Pas de session, tentative de connexion anonyme");
      await supabase.auth.signInAnonymously();
      console.log("✅ Connexion anonyme réussie");
    } else {
      console.log("✅ Session existante:", session.user.id);
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("Type de fichier non autorisé. Utilisez JPG, PNG ou WebP");
      throw new Error("Type de fichier non autorisé");
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Fichier trop volumineux (max 5MB)");
      throw new Error("Fichier trop volumineux");
    }

    const fileName = `${Date.now()}-${file.name.replace(
      /[^a-zA-Z0-9.]/g,
      "_"
    )}`;

    console.log("📤 Tentative d'upload pour:", fileName);
    console.log("📁 Bucket:", "blog-images");

    const { data, error } = await supabase.storage
      .from("blog-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("❌ Erreur détaillée:", error);
      if (error.message.includes("row-level security policy")) {
        toast.error(
          "Erreur de permission Storage. Vérifie que les policies sont configurées correctement."
        );
      } else {
        toast.error(`Erreur d'upload: ${error.message}`);
      }
      throw error;
    }

    if (!data?.path) {
      throw new Error("Pas de chemin retourné");
    }

    // Utilisation de getPublicUrl de Supabase pour obtenir l'URL publique correcte
    const {
      data: { publicUrl },
      error: publicUrlError,
    } = supabase.storage.from("blog-images").getPublicUrl(fileName);

    if (publicUrlError) {
      console.error("❌ Erreur getPublicUrl:", publicUrlError);
      throw publicUrlError;
    }

    console.log("🔗 URL publique:", publicUrl);
    return publicUrl;
  } catch (error: any) {
    console.error("❌ Erreur upload:", error);
    if (!error.message) {
      toast.error("Une erreur inattendue s'est produite");
    }
    throw error;
  }
}

"use client";

import { createClient } from "@supabase/supabase-js";
import { getSession } from "next-auth/react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export async function uploadImage(file: File) {
  try {
    const session = await getSession();
    if (!session?.user) {
      toast.error("Vous devez être connecté pour uploader une image");
      throw new Error("Non authentifié");
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

    const { data, error } = await supabase.storage
      .from("blog-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      toast.error(`Erreur: ${error.message}`);
      throw error;
    }

    if (!data?.path) {
      throw new Error("Pas de chemin retourné");
    }

    const { data: publicUrl } = supabase.storage
      .from("blog-images")
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  } catch (error) {
    console.error("Erreur upload:", error);
    throw error;
  }
}

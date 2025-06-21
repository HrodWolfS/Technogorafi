import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from("blog-images")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Supabase upload error:", uploadError);
    throw new Error("Error uploading image");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("blog-images").getPublicUrl(filePath);

  return publicUrl;
}

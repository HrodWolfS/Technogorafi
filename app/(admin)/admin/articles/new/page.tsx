"use client";

import Editor from "@/components/admin/Editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase, uploadImage } from "@/lib/supabase";
import { ChevronLeft, ImageIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Tag = {
  id: string;
  name: string;
  slug: string;
};

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "SCHEDULED">(
    "DRAFT"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/tags"),
        ]);

        if (!categoriesRes.ok || !tagsRes.ok) {
          throw new Error("Failed to fetch categories or tags");
        }

        const categoriesData = await categoriesRes.json();
        const tagsData = await tagsRes.json();

        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error("Error fetching categories and tags:", error);
        toast.error("Erreur lors du chargement des catégories et tags");
      }
    };

    fetchCategoriesAndTags();
  }, []);

  const handleImageUpload = async (file: File) => {
    try {
      // Vérifier la session Supabase
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("AVANT UPLOAD - SESSION:", !!session, session?.user?.id);

      setIsUploading(true);
      const imageUrl = await uploadImage(file);
      console.log("IMAGE URL:", imageUrl);

      setImage(imageUrl);
      toast.success("Image uploadée avec succès");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erreur lors de l'upload de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          status,
          image,
          categoryId: selectedCategory || null,
          tagIds: selectedTags,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create article");
      }

      const article = await response.json();
      toast.success("Article créé avec succès");
      router.push(`/admin/articles/${article.id}`);
    } catch (error) {
      console.error("Error creating article:", error);
      toast.error("Erreur lors de la création de l'article");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/articles">
              <ChevronLeft className="h-4 w-4" />
              Retour
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Nouvel article</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Le titre de votre article"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Extrait</Label>
            <Input
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Un bref résumé de votre article"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image d'en-tête</Label>
            <div className="flex items-center gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {isUploading && <span>Upload en cours...</span>}
              {image && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setImage(null)}
                >
                  Supprimer
                </Button>
              )}
            </div>
            {image && (
              <div className="mt-2 relative aspect-video w-full rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt="Aperçu"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            {!image && (
              <div className="mt-2 aspect-video w-full rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground/25" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={status}
              onValueChange={(value: "DRAFT" | "PUBLISHED" | "SCHEDULED") =>
                setStatus(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Brouillon</SelectItem>
                <SelectItem value="PUBLISHED">Publié</SelectItem>
                <SelectItem value="SCHEDULED">Planifié</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <select
              id="tags"
              multiple
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={selectedTags}
              onChange={(e) => {
                const values = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                setSelectedTags(values);
              }}
              aria-label="Sélectionner des tags"
            >
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Contenu</Label>
          <Editor onChange={setContent} />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/articles")}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Créer l'article"}
          </Button>
        </div>
      </form>
    </div>
  );
}

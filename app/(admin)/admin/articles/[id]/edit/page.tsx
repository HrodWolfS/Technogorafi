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
import { uploadImage } from "@/lib/supabase";
import { ChevronLeft, ImageIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

type Article = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string | null;
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED";
  categoryId: string;
  tags: { id: string; name: string }[];
};

export default function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const [articleData, tagsData, categoriesData] = await Promise.all([
          fetch(`/api/articles/${id}`).then((res) => {
            if (!res.ok) throw new Error("Article non trouvé");
            return res.json();
          }),
          fetch("/api/tags").then((res) => res.json()),
          fetch("/api/categories").then((res) => res.json()),
        ]);
        setArticle(articleData);
        setTags(tagsData);
        setCategories(categoriesData);
        setSelectedTags(
          articleData.tags?.map((t: { id: string }) => t.id) ?? []
        );
      } catch (error) {
        console.error("Error fetching article:", error);
        toast.error("Erreur lors du chargement de l'article");
        router.push("/admin/articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id, router]);

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const imageUrl = await uploadImage(file);
      setArticle((article) =>
        article ? { ...article, image: imageUrl } : null
      );
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
    if (!article) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          status: article.status,
          image: article.image,
          categoryId: article.categoryId,
          tagIds: selectedTags,
        }),
      });

      if (!response.ok) {
        throw new Error("Échec de la mise à jour");
      }

      toast.success("Article mis à jour avec succès");
      router.push("/admin/articles");
    } catch (error) {
      console.error("Error updating article:", error);
      toast.error("Erreur lors de la mise à jour de l'article");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!article) {
    return <div>Article non trouvé</div>;
  }

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
          <h1 className="text-3xl font-bold">Modifier l'article</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={article.title}
              onChange={(e) =>
                setArticle({ ...article, title: e.target.value })
              }
              placeholder="Le titre de votre article"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Extrait</Label>
            <Input
              id="excerpt"
              value={article.excerpt}
              onChange={(e) =>
                setArticle({ ...article, excerpt: e.target.value })
              }
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
              {article.image && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setArticle({ ...article, image: null })}
                >
                  Supprimer
                </Button>
              )}
            </div>
            {article.image && (
              <div className="mt-2 relative aspect-video w-full rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.image}
                  alt="Aperçu"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            {!article.image && (
              <div className="mt-2 aspect-video w-full rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground/25" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select
              value={article.categoryId}
              onValueChange={(value) =>
                setArticle((prev) => prev && { ...prev, categoryId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {selectedTags
                .map((id) => tags.find((t) => t.id === id))
                .filter(Boolean)
                .map((tag) => (
                  <div
                    key={tag!.id}
                    className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag!.name}
                    <button
                      type="button"
                      className="text-xs ml-1"
                      onClick={() =>
                        setSelectedTags((prev) =>
                          prev.filter((t) => t !== tag.id)
                        )
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
            </div>

            <Input
              type="text"
              placeholder="Rechercher un tag..."
              onChange={(e) => {
                const search = e.target.value.toLowerCase();
                const match = tags.find(
                  (t) =>
                    t.name.toLowerCase() === search &&
                    !selectedTags.includes(t.id)
                );
                if (match) {
                  setSelectedTags([...selectedTags, match.id]);
                  e.target.value = "";
                }
              }}
            />

            <div className="flex flex-wrap gap-2 mt-2">
              {tags
                .filter((tag) => !selectedTags.includes(tag.id))
                .map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => setSelectedTags([...selectedTags, tag.id])}
                    className="border border-muted px-2 py-1 rounded-full text-sm hover:bg-muted"
                  >
                    {tag.name}
                  </button>
                ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={article.status}
              onValueChange={(value: "DRAFT" | "PUBLISHED" | "SCHEDULED") =>
                setArticle({ ...article, status: value })
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
        </div>

        <div className="space-y-2">
          <Label>Contenu</Label>
          <Editor
            initialContent={article.content}
            onChange={(content) => setArticle({ ...article, content })}
          />
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
            {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
          </Button>
        </div>
      </form>
    </div>
  );
}

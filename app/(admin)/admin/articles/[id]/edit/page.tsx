"use client";

import slugify from "slugify";

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
  scheduledAt: string | null | undefined;
  publishedAt: string | null | undefined;
};

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

export default function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState("");
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

    console.log("Payload envoyé :", {
      id,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      status: article.status,
      image: article.image,
      categoryId: article.categoryId,
      tagIds: selectedTags,
      scheduledAt: article.scheduledAt,
    });

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          status: article.status,
          image: article.image,
          categoryId: article.categoryId,
          tagIds: selectedTags,
          scheduledAt: article.scheduledAt,
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
            <Label htmlFor="tags">Tags</Label>
            <div className="flex flex-wrap gap-2">
              {selectedTags
                .map((tagId) => tags.find((t) => t.id === tagId))
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
                          prev.filter((id) => id !== tag!.id)
                        )
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
            </div>

            <div className="relative">
              <Input
                type="text"
                placeholder="Rechercher ou créer un tag..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="mt-2"
              />
              {newTagName && (
                <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-md max-h-48 overflow-auto">
                  {tags
                    .filter(
                      (tag) =>
                        tag.name
                          .toLowerCase()
                          .includes(newTagName.toLowerCase()) &&
                        !selectedTags.includes(tag.id)
                    )
                    .map((tag) => (
                      <div
                        key={tag.id}
                        onClick={() => {
                          setSelectedTags((prev) => [...prev, tag.id]);
                          setNewTagName("");
                        }}
                        className="cursor-pointer px-4 py-2 hover:bg-muted"
                      >
                        {tag.name}
                      </div>
                    ))}
                  {!tags.some(
                    (t) => t.name.toLowerCase() === newTagName.toLowerCase()
                  ) && (
                    <div
                      onClick={async () => {
                        try {
                          const res = await fetch("/api/tags", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              name: newTagName,
                              slug: slugify(newTagName, {
                                lower: true,
                                strict: true,
                              }),
                            }),
                            credentials: "include",
                          });
                          if (!res.ok) throw new Error();
                          const createdTag = await res.json();
                          setTags((prev) => [...prev, createdTag]);
                          setSelectedTags((prev) => [...prev, createdTag.id]);
                          setNewTagName("");
                          toast.success("Tag créé !");
                        } catch (err) {
                          toast.error("Erreur lors de la création du tag");
                        }
                      }}
                      className="cursor-pointer px-4 py-2 hover:bg-muted text-primary"
                    >
                      Créer le tag "{newTagName}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={article.status}
              onValueChange={(value: "DRAFT" | "PUBLISHED" | "SCHEDULED") => {
                setArticle((prev) =>
                  prev
                    ? {
                        ...prev,
                        status: value,
                        scheduledAt:
                          value === "SCHEDULED"
                            ? (prev.scheduledAt ?? new Date().toISOString())
                            : null,
                        publishedAt:
                          value === "PUBLISHED"
                            ? (prev.publishedAt ?? new Date().toISOString())
                            : null,
                      }
                    : prev
                );
              }}
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
            {article.status === "SCHEDULED" && (
              <div className="flex items-end gap-4">
                <div className="space-y-2 w-1/2">
                  <Label htmlFor="scheduledDate">Date</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={
                      article.scheduledAt
                        ? new Date(article.scheduledAt).toLocaleDateString(
                            "fr-CA"
                          )
                        : ""
                    }
                    onChange={(e) => {
                      const [year, month, day] = e.target.value.split("-");
                      // On récupère l'heure actuelle prévue (sinon 0 par défaut)
                      const prevDate = article.scheduledAt
                        ? new Date(article.scheduledAt)
                        : new Date();

                      // Utiliser getHours() au lieu de getUTCHours() pour avoir l'heure locale
                      const hour = prevDate.getHours();

                      // On crée la date UTC propre, en tenant compte du fuseau horaire de Paris (UTC+2)
                      const newUTCDate = new Date(
                        Date.UTC(
                          parseInt(year),
                          parseInt(month) - 1,
                          parseInt(day),
                          hour - 2, // On soustrait 2h pour compenser UTC+2
                          0,
                          0
                        )
                      );

                      setArticle({
                        ...article,
                        scheduledAt: newUTCDate.toISOString(),
                      });
                    }}
                  />
                </div>

                <div className="space-y-2 w-1/2">
                  <Label htmlFor="scheduledHour">Heure</Label>
                  <select
                    id="scheduledHour"
                    aria-label="Heure de publication planifiée"
                    className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
                    value={
                      article.scheduledAt
                        ? new Date(article.scheduledAt).getHours()
                        : ""
                    }
                    onChange={(e) => {
                      const selectedLocalHour = parseInt(e.target.value, 10);
                      const prevDate = article.scheduledAt
                        ? new Date(article.scheduledAt)
                        : new Date();
                      const year = prevDate.getFullYear();
                      const month = prevDate.getMonth();
                      const day = prevDate.getDate();

                      // Créer une date en UTC avec l'heure locale correcte (pour Paris)
                      // Pour stocker 12h heure de Paris (UTC+2), on doit stocker 10h en UTC
                      // On soustrait donc 2h pour compenser le décalage UTC+2
                      const date = new Date(
                        Date.UTC(
                          year,
                          month,
                          day,
                          selectedLocalHour - 2, // Compensation UTC+2 pour Paris
                          0,
                          0
                        )
                      );

                      console.log(
                        `Heure sélectionnée: ${selectedLocalHour}:00 (heure de Paris) -> ${date.toISOString()} (UTC)`
                      );

                      setArticle({
                        ...article,
                        scheduledAt: date.toISOString(),
                      });
                    }}
                  >
                    <option value="" disabled>
                      Sélectionner une heure
                    </option>
                    {Array.from({ length: 24 }, (_, i) => {
                      return (
                        <option key={i} value={i}>
                          {String(i).padStart(2, "0")}:00
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            )}
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

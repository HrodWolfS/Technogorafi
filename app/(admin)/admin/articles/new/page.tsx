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
  const [scheduledAt, setScheduledAt] = useState<string | null>(null);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState("");

  // Mise à jour du statut avec gestion des dates
  const handleStatusChange = (value: "DRAFT" | "PUBLISHED" | "SCHEDULED") => {
    setStatus(value);

    // Gestion de scheduledAt
    if (value === "SCHEDULED") {
      setScheduledAt(scheduledAt || new Date().toISOString());
      setPublishedAt(null);
    }
    // Gestion de publishedAt
    else if (value === "PUBLISHED") {
      setPublishedAt(new Date().toISOString());
      setScheduledAt(null);
    }
    // Réinitialisation des deux si DRAFT
    else {
      setScheduledAt(null);
      setPublishedAt(null);
    }
  };

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
        credentials: "include",
        body: JSON.stringify({
          title,
          excerpt,
          content,
          status,
          image,
          categoryId: selectedCategory || null,
          tagIds: selectedTags,
          scheduledAt,
          publishedAt,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create article");
      }

      const article = await response.json();
      toast.success("Article créé avec succès");
      router.push("/admin/articles");
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
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Brouillon</SelectItem>
                <SelectItem value="PUBLISHED">Publié</SelectItem>
                <SelectItem value="SCHEDULED">Planifié</SelectItem>
              </SelectContent>
            </Select>
            {status === "SCHEDULED" && (
              <div className="flex items-end gap-4">
                <div className="space-y-2 w-1/2">
                  <Label htmlFor="scheduledDate">Date</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={
                      scheduledAt
                        ? new Date(scheduledAt).toLocaleDateString("fr-CA")
                        : ""
                    }
                    onChange={(e) => {
                      const [year, month, day] = e.target.value.split("-");
                      // On récupère l'heure actuelle prévue (sinon 0 par défaut)
                      const prevDate = scheduledAt
                        ? new Date(scheduledAt)
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

                      setScheduledAt(newUTCDate.toISOString());
                    }}
                  />
                </div>

                <div className="space-y-2 w-1/2">
                  <Label htmlFor="scheduledHour">Heure</Label>
                  <select
                    id="scheduledHour"
                    aria-label="Heure de publication planifiée"
                    className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
                    value={scheduledAt ? new Date(scheduledAt).getHours() : ""}
                    onChange={(e) => {
                      const selectedLocalHour = parseInt(e.target.value, 10);
                      const prevDate = scheduledAt
                        ? new Date(scheduledAt)
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

                      setScheduledAt(date.toISOString());
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

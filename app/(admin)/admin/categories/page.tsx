"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import slugify from "slugify";
import { toast } from "sonner";

type Category = {
  id: string;
  name: string;
  slug: string;
  _count: {
    articles: number;
  };
};

type Tag = {
  id: string;
  name: string;
  slug: string;
  _count: {
    articles: number;
  };
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategoriesAndTags();
  }, []);

  const fetchCategoriesAndTags = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/tags"),
      ]);

      if (!categoriesRes.ok || !tagsRes.ok) {
        throw new Error("Erreur lors du chargement des données");
      }

      const [categoriesData, tagsData] = await Promise.all([
        categoriesRes.json(),
        tagsRes.json(),
      ]);

      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur lors du chargement des données");
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Le nom de la catégorie est requis");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategoryName,
          slug: slugify(newCategoryName, { lower: true, strict: true }),
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la catégorie");
      }

      setNewCategoryName("");
      await fetchCategoriesAndTags();
      toast.success("Catégorie créée avec succès");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur lors de la création de la catégorie");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast.error("Le nom du tag est requis");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTagName,
          slug: slugify(newTagName, { lower: true, strict: true }),
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création du tag");
      }

      setNewTagName("");
      await fetchCategoriesAndTags();
      toast.success("Tag créé avec succès");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur lors de la création du tag");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la suppression");
      }

      await fetchCategoriesAndTags();
      toast.success("Catégorie supprimée avec succès");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const handleDeleteTag = async (id: string) => {
    try {
      const response = await fetch(`/api/tags?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la suppression");
      }

      await fetchCategoriesAndTags();
      toast.success("Tag supprimé avec succès");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const handleUpdateCategory = async (category: Category) => {
    try {
      const response = await fetch(`/api/categories`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: category.id,
          name: category.name,
          slug: slugify(category.name, { lower: true, strict: true }),
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      setEditingCategory(null);
      await fetchCategoriesAndTags();
      toast.success("Catégorie mise à jour avec succès");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleUpdateTag = async (tag: Tag) => {
    try {
      const response = await fetch(`/api/tags`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: tag.id,
          name: tag.name,
          slug: slugify(tag.name, { lower: true, strict: true }),
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      setEditingTag(null);
      await fetchCategoriesAndTags();
      toast.success("Tag mis à jour avec succès");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestion des catégories et tags</h1>
      </div>

      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <Card className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="newCategory">Nouvelle catégorie</Label>
                <Input
                  id="newCategory"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nom de la catégorie"
                />
              </div>
              <Button
                onClick={handleCreateCategory}
                disabled={isLoading || !newCategoryName.trim()}
                className="self-end"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </Card>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      {editingCategory?.id === category.id ? (
                        <Input
                          value={editingCategory.name}
                          onChange={(e) =>
                            setEditingCategory({
                              ...editingCategory,
                              name: e.target.value,
                            })
                          }
                          onBlur={() => handleUpdateCategory(editingCategory)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleUpdateCategory(editingCategory);
                            }
                          }}
                        />
                      ) : (
                        category.name
                      )}
                    </TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>{category._count.articles}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingCategory(category)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={category._count.articles > 0}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="tags" className="space-y-4">
          <Card className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="newTag">Nouveau tag</Label>
                <Input
                  id="newTag"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Nom du tag"
                />
              </div>
              <Button
                onClick={handleCreateTag}
                disabled={isLoading || !newTagName.trim()}
                className="self-end"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </Card>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>
                      {editingTag?.id === tag.id ? (
                        <Input
                          value={editingTag.name}
                          onChange={(e) =>
                            setEditingTag({
                              ...editingTag,
                              name: e.target.value,
                            })
                          }
                          onBlur={() => handleUpdateTag(editingTag)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleUpdateTag(editingTag);
                            }
                          }}
                        />
                      ) : (
                        tag.name
                      )}
                    </TableCell>
                    <TableCell>{tag.slug}</TableCell>
                    <TableCell>{tag._count.articles}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingTag(tag)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTag(tag.id)}
                          disabled={tag._count.articles > 0}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

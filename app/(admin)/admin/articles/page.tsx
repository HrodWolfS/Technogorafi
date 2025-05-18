"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, MessageSquare, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const dynamic = "force-dynamic";

type Status = "DRAFT" | "PUBLISHED" | "SCHEDULED";

type Article = {
  id: string;
  title: string;
  excerpt: string;
  status: Status;
  createdAt: Date;
  scheduledAt: Date | null;
  _count: {
    comments: number;
  };
};

const statusConfig: Record<
  Status,
  { label: string; variant: "default" | "secondary" | "destructive" }
> = {
  PUBLISHED: { label: "Publié", variant: "default" },
  SCHEDULED: { label: "Planifié", variant: "secondary" },
  DRAFT: { label: "Brouillon", variant: "destructive" },
};

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Récupération des articles au chargement
  useEffect(() => {
    async function loadArticles() {
      try {
        const response = await fetch("/api/admin/articles", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setArticles(data);
      } catch (error) {
        toast.error("Erreur lors du chargement des articles");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadArticles();
  }, []);

  // Fonction de suppression avec confirmation
  const handleDelete = async (id: string, title: string) => {
    // Confirmation de suppression
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'article "${title}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/articles?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      // Mettre à jour la liste des articles
      setArticles((prev) => prev.filter((article) => article.id !== id));
      router.refresh(); // Rafraîchir la page pour mettre à jour tous les composants
      toast.success("Article supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression de l'article");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/dashboard">
              <ChevronLeft className="h-4 w-4" />
              Retour
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Articles</h1>
        </div>
        <Button asChild>
          <Link href="/admin/articles/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel article
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Chargement des articles...</div>
      ) : articles.length === 0 ? (
        <div className="text-center p-8 bg-muted rounded-lg text-muted-foreground">
          Aucun article pour le moment.
          <br />
          Commencez par en créer un !
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Titre</TableHead>
                <TableHead className="hidden md:table-cell">Extrait</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead>Comm.</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="text-primary hover:underline"
                    >
                      {article.title}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="truncate max-w-xs">{article.excerpt}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[article.status].variant}>
                      {statusConfig[article.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {article.status === "SCHEDULED" && article.scheduledAt
                      ? new Date(article.scheduledAt).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : new Date(article.createdAt).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{article._count.comments}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(article.id, article.title)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { ChevronLeft, MessageSquare, Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Status = "DRAFT" | "PUBLISHED" | "SCHEDULED";

const statusConfig: Record<
  Status,
  { label: string; variant: "default" | "secondary" | "destructive" }
> = {
  PUBLISHED: { label: "Publié", variant: "default" },
  SCHEDULED: { label: "Planifié", variant: "secondary" },
  DRAFT: { label: "Brouillon", variant: "destructive" },
};

async function getArticlesWithStats() {
  return prisma.article.findMany({
    select: {
      id: true,
      title: true,
      excerpt: true,
      status: true,
      createdAt: true,
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default async function ArticlesPage() {
  const articles = await getArticlesWithStats();

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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link key={article.id} href={`/admin/articles/${article.id}/edit`}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="line-clamp-1">
                    {article.title}
                  </CardTitle>
                  <Badge
                    variant={statusConfig[article.status as Status].variant}
                  >
                    {statusConfig[article.status as Status].label}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {article.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{article._count.comments}</span>
                  </div>
                  <div>
                    {new Date(article.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {articles.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">
          Aucun article pour le moment.
          <br />
          Commencez par en créer un !
        </Card>
      )}
    </div>
  );
}

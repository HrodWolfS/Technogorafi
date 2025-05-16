import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { BarChart2, FileText, FolderOpen, MessageSquare } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const articlesCount = await prisma.article.count();
  const commentsCount = await prisma.comment.count();
  const viewsCount = await prisma.view.count();

  const sections = [
    {
      title: "Articles",
      description: `${articlesCount} article${articlesCount > 1 ? "s" : ""}`,
      href: "/admin/articles",
      icon: FileText,
    },
    {
      title: "Commentaires",
      description: `${commentsCount} commentaire${
        commentsCount > 1 ? "s" : ""
      }`,
      href: "/admin/comments",
      icon: MessageSquare,
    },
    {
      title: "Catégories & Tags",
      description: "Gérer les catégories et les tags",
      href: "/admin/categories",
      icon: FolderOpen,
    },
    {
      title: "Statistiques",
      description: `${viewsCount} vue${viewsCount > 1 ? "s" : ""}`,
      href: "/admin/statistiques",
      icon: BarChart2,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Administration</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Button
              key={section.href}
              variant="outline"
              className="h-auto p-0 hover:border-primary"
              asChild
            >
              <Link href={section.href}>
                <Card className="w-full border-0">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle>{section.title}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

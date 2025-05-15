"use client";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

type Comment = {
  id: string;
  name: string;
  email: string;
  content: string;
  approved: boolean;
  createdAt: Date;
  article: {
    title: string;
    slug: string;
  };
};

export const columns: ColumnDef<Comment>[] = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "content",
    header: "Contenu",
  },
  {
    accessorKey: "article.title",
    header: "Article",
    cell: ({ row }) => (
      <a
        href={`/article/${row.original.article.slug}`}
        className="text-primary hover:underline"
      >
        {row.original.article.title}
      </a>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const comment = row.original;
      const { approveComment, deleteComment } = table.options.meta as {
        approveComment: (formData: FormData) => Promise<void>;
        deleteComment: (formData: FormData) => Promise<void>;
      };

      return (
        <div className="flex gap-2">
          {!comment.approved && (
            <form action={approveComment}>
              <input type="hidden" name="commentId" value={comment.id} />
              <Button variant="outline" size="sm">
                Approuver
              </Button>
            </form>
          )}

          <form action={deleteComment}>
            <input type="hidden" name="commentId" value={comment.id} />
            <Button variant="destructive" size="sm">
              Supprimer
            </Button>
          </form>
        </div>
      );
    },
  },
];

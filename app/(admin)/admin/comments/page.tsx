"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { approveComment, deleteComment } from "./actions";
import { columns } from "./columns";

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

async function getComments() {
  const response = await fetch("/api/comments");
  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }
  return response.json();
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);

  const loadComments = () => {
    getComments().then(setComments).catch(console.error);
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleApproveComment = async (formData: FormData) => {
    try {
      await approveComment(formData);
      toast.success("Commentaire approuvé");
      loadComments();
    } catch (error) {
      console.error("Erreur lors de l'approbation du commentaire:", error);
      toast.error("Erreur lors de l'approbation du commentaire");
    }
  };

  const handleDeleteComment = async (formData: FormData) => {
    try {
      await deleteComment(formData);
      toast.success("Commentaire supprimé");
      loadComments();
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire:", error);
      toast.error("Erreur lors de la suppression du commentaire");
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/dashboard">
              <ChevronLeft className="h-4 w-4" />
              Retour
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Commentaires</h1>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={comments}
        approveComment={handleApproveComment}
        deleteComment={handleDeleteComment}
      />
    </div>
  );
}

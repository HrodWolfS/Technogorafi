"use client";

import { formatDate } from "@/lib/utils";
import useSWR from "swr";
import CommentForm from "./CommentForm";
import { Skeleton } from "./ui/skeleton";

type Comment = {
  id: string;
  name: string;
  content: string;
  createdAt: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Comments({ articleId }: { articleId: string }) {
  const { data: comments, isLoading } = useSWR<Comment[]>(
    `/api/articles/${articleId}/comments`,
    fetcher,
    {
      refreshInterval: 5000, // Rafraîchir toutes les 5 secondes
    }
  );

  if (isLoading) {
    return (
      <div className="mt-12 space-y-8">
        <div className="flex items-center gap-2">
          <div className="text-orange-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Commentaires</h2>
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-l-2 border-orange-500 pl-4">
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-8">
      <div className="flex items-center gap-2">
        <div className="text-orange-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold">Commentaires</h2>
      </div>

      <div className="space-y-6">
        {comments?.map((comment) => (
          <div key={comment.id} className="border-l-2 border-orange-500 pl-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                  {comment.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-foreground">
                  {comment.name}
                </span>
              </div>
              <span>•</span>
              <time>{formatDate(new Date(comment.createdAt))}</time>
            </div>
            <p className="mt-2">{comment.content}</p>
          </div>
        ))}

        {(!comments || comments.length === 0) && (
          <p className="text-muted-foreground">
            Aucun commentaire pour le moment. Soyez le premier à commenter !
          </p>
        )}
      </div>

      <CommentForm articleId={articleId} />
    </div>
  );
}

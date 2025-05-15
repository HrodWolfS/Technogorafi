"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveComment(formData: FormData) {
  const commentId = formData.get("commentId") as string;

  try {
    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        approved: true,
      },
    });

    revalidatePath("/admin/comments");
    revalidatePath("/admin/dashboard");
  } catch (error) {
    console.error("[APPROVE_COMMENT]", error);
    throw new Error("Failed to approve comment");
  }
}

export async function deleteComment(formData: FormData) {
  const commentId = formData.get("commentId") as string;

  try {
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    revalidatePath("/admin/comments");
    revalidatePath("/admin/dashboard");
  } catch (error) {
    console.error("[DELETE_COMMENT]", error);
    throw new Error("Failed to delete comment");
  }
}

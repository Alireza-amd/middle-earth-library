"use server";

import { getCurrentUser } from "@/auth/currentUser";
import { canAdminDeleteComment } from "../permissions/comment";

import { deleteCommentAdmin } from "../db/adminComment";

export async function deleteAdminComment(commentId: string) {
  const user = await getCurrentUser({});

  if (!canAdminDeleteComment(user)) {
    return {
      error: true,
      message: "You don't have permission.",
    };
  }

  await deleteCommentAdmin(commentId);

  return {
    error: false,
    message: "Comment deleted successfully.",
  };
}

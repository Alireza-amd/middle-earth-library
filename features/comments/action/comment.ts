"use server";

import z from "zod";
import { insertCommentSchema } from "../schema/comment";
import {
  insertComment as insertCommentDB,
  deleteComment as deleteCommentDb,
  likeAndDislikeComment,
  updateComment as updateCommentDB,
  deleteCommentLike,
  isUserDeletingCommentLike,
} from "../db/comment";
import {
  canDeleteComment,
  canInsertComment,
  canLikeComment,
  canUpdateComment,
} from "../permissions/comment";
import { getCurrentUser } from "@/auth/currentUser";
import { db } from "@/drizzle/db";
import { commentLikesTable, commentTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function insertComment(
  unsafeData: z.infer<typeof insertCommentSchema>,
) {
  const { success, data } = insertCommentSchema.safeParse(unsafeData);

  if (
    !success ||
    !canInsertComment(await getCurrentUser({ redirectIfNotFound: true }))
  )
    throw new Error("Inserting comment failed.");

  await insertCommentDB(data);

  return { error: false, message: "Comment inserted succesfully." };
}

export async function updateComment(
  id: string,
  unsafeData: z.infer<typeof insertCommentSchema>,
) {
  const { success, data } = insertCommentSchema.safeParse(unsafeData);

  if (
    !success ||
    !(await canUpdateComment({
      user: await getCurrentUser({ redirectIfNotFound: true }),
      commentId: id,
    }))
  )
    throw new Error("Updating comment failed.");

  await updateCommentDB(id, data);

  return { error: false, message: "Comment updated succesfully." };
}

export async function deleteComment(id: string) {
  if (
    !(await canDeleteComment({
      user: await getCurrentUser({ redirectIfNotFound: true }),
      commentId: id,
    }))
  )
    return {
      error: true,
      message: "You don't have permission to delete comment.",
    };

  await deleteCommentDb(id);

  return { error: false, message: "Comment deleted succesfully." };
}

export async function likeComment({
  bookId,
  commentId,
  isLike,
}: {
  commentId: string;
  bookId: string;
  isLike: boolean;
}) {
  const user = await getCurrentUser({ redirectIfNotFound: true });

  if (
    !canLikeComment({
      user,
    })
  )
    return {
      error: true,
      message: "You don't have permission to like comment.",
    };

  if (
    await isUserDeletingCommentLike({
      userId: user.id,
      commentId,
      isLike,
    })
  ) {
    await deleteCommentLike({ commentId, userId: user.id, bookId });
    return { error: false, message: "Comment deleted succesfully." };
  }

  await likeAndDislikeComment({ commentId, userId: user.id, isLike, bookId });
  return {
    error: false,
    message: `Comment ${isLike ? "liked" : "disliked"} succesfully.`,
  };
}

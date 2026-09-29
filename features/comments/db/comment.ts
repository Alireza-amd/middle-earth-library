"use server";

import { db } from "@/drizzle/db";
import { commentLikesTable, commentTable, userTable } from "@/drizzle/schema";
import { and, eq, sql } from "drizzle-orm";
import { revalidateCommentCache } from "./cache";
import { cacheTag, revalidateTag } from "next/cache";
import { getBookTag, getUserTag } from "@/lib/cacheTag";

export async function insertComment(data: typeof commentTable.$inferInsert) {
  const [insertedComment] = await db
    .insert(commentTable)
    .values(data)
    .returning();

  if (insertedComment == null) throw new Error("Failed to insert comment.");

  revalidateCommentCache(insertedComment.id);
  revalidateTag(getBookTag("comment", data.bookId), { expire: 0 });

  return insertedComment;
}

// export async function getBookComments(bookId: string) {
//   "use cache";

//   cacheTag(getBookTag("comment", bookId));

//   return await db.query.commentTable.findMany({
//     where: eq(commentTable.bookId, bookId),
//     with: {
//       user: { columns: { name: true, id: true } },
//       commentLikes: { columns: { userId: true, like: true } },
//     },
//     columns: {
//       content: true,
//       createdAt: true,
//       likes: true,
//       dislikes: true,
//       id: true,
//       spoiler: true,
//       parentId: true,
//     },
//   });
// }

export async function getBookComments(bookId: string, userId?: string) {
  "use cache";

  cacheTag(getBookTag("comment", bookId));
  if (userId) cacheTag(getUserTag("comment", userId));

  return await db
    .select({
      content: commentTable.content,
      createdAt: commentTable.createdAt,
      id: commentTable.id,
      spoiler: commentTable.spoiler,
      parentId: commentTable.parentId,

      user: {
        id: userTable.id,
        name: userTable.name,
      },

      likes: sql<number>`count(*) filter (where ${commentLikesTable.like} = true)::int`,
      dislikes: sql<number>`count(*) filter (where ${commentLikesTable.like} = false)::int`,

      userLike: userId
        ? sql<boolean>`bool_or(${commentLikesTable.like}) filter (where ${commentLikesTable.userId} = ${userId})`
        : sql<boolean>`null::boolean`,
    })
    .from(commentTable)
    .innerJoin(userTable, eq(userTable.id, commentTable.userId))
    .leftJoin(
      commentLikesTable,
      eq(commentLikesTable.commentId, commentTable.id),
    )
    .where(eq(commentTable.bookId, bookId))
    .groupBy(commentTable.id, userTable.id, userTable.name);
}

export async function deleteComment(id: string) {
  const [deletedComment] = await db
    .delete(commentTable)
    .where(eq(commentTable.id, id))
    .returning();

  if (deletedComment == null) throw new Error("Failed to delete comment.");

  revalidateCommentCache(deletedComment.id);
  revalidateTag(getBookTag("comment", deletedComment.bookId), { expire: 0 });

  return deletedComment;
}

export async function updateComment(
  id: string,
  data: Partial<typeof commentTable.$inferInsert>,
) {
  const [updatedComment] = await db
    .update(commentTable)
    .set(data)
    .where(eq(commentTable.id, id))
    .returning();

  if (updatedComment == null) throw new Error("Failed to update comment.");

  revalidateCommentCache(updatedComment.id);
  revalidateTag(getBookTag("comment", updatedComment.bookId), { expire: 0 });

  return updatedComment;
}

export async function deleteCommentLike({
  commentId,
  userId,
  bookId,
}: {
  commentId: string;
  userId: string;
  bookId: string;
}) {
  const [deletedCommentLike] = await db
    .delete(commentLikesTable)
    .where(
      and(
        eq(commentLikesTable.userId, userId),
        eq(commentLikesTable.commentId, commentId),
      ),
    )
    .returning();

  if (deletedCommentLike == null)
    throw new Error("Failed to delete commentlike.");

  revalidateCommentCache(deletedCommentLike.commentId);
  revalidateTag(getBookTag("comment", bookId), { expire: 0 });
  revalidateTag(getUserTag("comment", userId), { expire: 0 });

  return deletedCommentLike;
}
export async function likeAndDislikeComment({
  commentId,
  isLike,
  userId,
  bookId,
}: {
  commentId: string;
  userId: string;
  isLike: boolean;
  bookId: string;
}) {
  const [insertedLike] = await db
    .insert(commentLikesTable)
    .values({ userId, commentId, like: isLike })
    .onConflictDoUpdate({
      target: [commentLikesTable.commentId, commentLikesTable.userId],
      set: { like: isLike },
    })
    .returning();

  revalidateCommentCache(insertedLike.commentId);
  revalidateTag(getBookTag("comment", bookId), { expire: 0 });
  revalidateTag(getUserTag("comment", userId), { expire: 0 });

  return insertedLike;
}

export async function isUserDeletingCommentLike({
  userId,
  commentId,
  isLike,
}: {
  userId: string;
  commentId: string;
  isLike: boolean;
}) {
  const [comment] = await db
    .select()
    .from(commentLikesTable)
    .where(
      and(
        eq(commentLikesTable.userId, userId),
        eq(commentLikesTable.commentId, commentId),
        eq(commentLikesTable.like, isLike),
      ),
    );

  return comment != null;
}

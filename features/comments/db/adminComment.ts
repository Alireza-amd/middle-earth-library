import { cacheTag } from "next/cache";
import { db } from "@/drizzle/db";
import { commentTable } from "@/drizzle/schema";
import { getCommentGlobalTag, revalidateCommentCache } from "./cache";
import { eq } from "drizzle-orm";

const PAGE_SIZE = 5;

export async function getAdminComments(page: number) {
  "use cache";

  cacheTag(getCommentGlobalTag());

  const comments = await db.query.commentTable.findMany({
    columns: {
      id: true,
      content: true,
      likes: true,
      dislikes: true,
      createdAt: true,
      parentId: true,
      bookId: true,
    },

    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },

      book: {
        columns: {
          id: true,
          title: true,
        },
      },
    },

    limit: PAGE_SIZE,

    offset: (page - 1) * PAGE_SIZE,

    orderBy: (comment, { desc }) => [desc(comment.createdAt)],
  });

  const total = await db.$count(commentTable);

  return {
    comments,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}

export async function deleteCommentAdmin(commentId: string) {
  const [deletedComment] = await db
    .delete(commentTable)
    .where(eq(commentTable.id, commentId))
    .returning();

  if (deletedComment == null) throw new Error("Failed to delete comment.");

  revalidateCommentCache(deletedComment.id);
}

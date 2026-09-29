import { TUser } from "@/auth/currentUser";
import { db } from "@/drizzle/db";
import { commentTable, TUserRoles } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export function canInsertComment({ role }: { role: TUserRoles }) {
  return role == "admin" || role == "user";
}

export async function canUpdateComment({
  user,
  commentId,
}: {
  user: Pick<TUser, "id" | "role">;
  commentId: string;
}) {
  const comment = await db.query.commentTable.findFirst({
    where: and(
      eq(commentTable.id, commentId),
      eq(commentTable.userId, user.id),
    ),
  });

  return comment != null;
}

export async function canDeleteComment({
  user,
  commentId,
}: {
  user: Pick<TUser, "id" | "role">;
  commentId: string;
}) {
  if (user.role == "admin") return true;

  const comment = await db.query.commentTable.findFirst({
    where: and(
      eq(commentTable.id, commentId),
      eq(commentTable.userId, user.id),
    ),
  });

  return comment != null;
}

export function canLikeComment({ user }: { user: Pick<TUser, "role"> }) {
  return user.role == "admin" || user.role == "user";
}

export function canAdminDeleteComment(user: TUser | null) {
  if (user == null) return false;

  return user.role === "admin";
}

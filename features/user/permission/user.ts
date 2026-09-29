import { TUser } from "@/auth/currentUser";
import { db } from "@/drizzle/db";
import { userTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function canUpdateUserRole({
  currentUser,
  targetUserId,
}: {
  currentUser: TUser;
  targetUserId: string;
}) {
  if (currentUser.role !== "admin") return false;

  if (currentUser.id === targetUserId) return false;

  const targetUser = await db.query.userTable.findFirst({
    where: eq(userTable.id, targetUserId),
    columns: {
      id: true,
      role: true,
    },
  });

  if (!targetUser) return false;

  return targetUser.role !== "admin";
}

export async function canBanUser({
  currentUser,
  targetUserId,
}: {
  currentUser: TUser;
  targetUserId: string;
}) {
  if (currentUser.role !== "admin") return false;

  if (currentUser.id === targetUserId) return false;

  const targetUser = await db.query.userTable.findFirst({
    where: eq(userTable.id, targetUserId),
    columns: {
      id: true,
      role: true,
    },
  });

  if (!targetUser) return false;

  return targetUser.role !== "admin";
}

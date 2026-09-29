import { cacheTag } from "next/cache";
import { db } from "@/drizzle/db";
import { TUserRoles, userTable } from "@/drizzle/schema";
import { getUserGlobalTag, revalidateUserCache } from "../db/cache";
import { and, desc, eq, ilike } from "drizzle-orm";

const PAGE_SIZE = 10;

export async function getUsers({
  email,
  page,
}: {
  email?: string;
  page: number;
}) {
  "use cache";

  cacheTag(getUserGlobalTag());

  return db.query.userTable.findMany({
    where: and(email ? ilike(userTable.email, `%${email}%`) : undefined),

    columns: {
      id: true,
      name: true,
      email: true,
      role: true,
      banned: true,
      createdAt: true,
    },

    orderBy: [desc(userTable.createdAt)],

    limit: PAGE_SIZE,

    offset: (page - 1) * PAGE_SIZE,
  });
}

export async function getUsersCount(email?: string) {
  "use cache";

  cacheTag(getUserGlobalTag());

  const result = await db.$count(
    userTable,
    email ? ilike(userTable.email, `%${email}%`) : undefined,
  );

  return Math.ceil(result / PAGE_SIZE);
}

export async function updateUserRole(userId: string, role: TUserRoles) {
  const [updatedUser] = await db
    .update(userTable)
    .set({
      role,
    })
    .where(eq(userTable.id, userId))
    .returning();

  if (!updatedUser) throw new Error("User not found.");

  revalidateUserCache(updatedUser.id);
}

export async function updateUserBan(userId: string, banned: boolean) {
  const [updatedUser] = await db
    .update(userTable)
    .set({
      banned,
    })
    .where(eq(userTable.id, userId))
    .returning();

  if (!updatedUser) throw new Error("User not found.");

  revalidateUserCache(updatedUser.id);
}

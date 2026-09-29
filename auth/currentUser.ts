import { db } from "@/drizzle/db";
import { userTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { getUserFromSession } from "./session";
import { cache } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { cacheTag } from "next/cache";

export const CURRENT_USER_CACHE_TAG = "current-user";

export type TFullUser = Awaited<ReturnType<typeof getUserFromDB>>;
export type TUser = Exclude<
  Awaited<ReturnType<typeof getUserFromSession>>,
  null | undefined
>;

async function _getCurrentUser({
  getFullUser,
  redirectIfNotFound,
}: {
  getFullUser: true;
  redirectIfNotFound: true;
}): Promise<TFullUser>;
async function _getCurrentUser({
  getFullUser,
  redirectIfNotFound,
}: {
  getFullUser: true;
  redirectIfNotFound?: false;
}): Promise<TFullUser | null>;
async function _getCurrentUser({
  getFullUser,
  redirectIfNotFound,
}: {
  getFullUser?: false;
  redirectIfNotFound: true;
}): Promise<TUser>;
async function _getCurrentUser({
  getFullUser,
  redirectIfNotFound,
}: {
  getFullUser?: false;
  redirectIfNotFound?: false;
}): Promise<TUser | null>;
async function _getCurrentUser({
  getFullUser = false,
  redirectIfNotFound = false,
}: {
  getFullUser?: boolean;
  redirectIfNotFound?: boolean;
}) {
  "use cache: private";

  cacheTag(CURRENT_USER_CACHE_TAG);
  const clientCookies = await cookies();
  const user = await getUserFromSession(clientCookies);

  if (user == null) {
    if (redirectIfNotFound) redirect("/sign-in");
    return null;
  }

  if (getFullUser) return await getUserFromDB(user.id);

  return user;
}

export const getCurrentUser = cache(_getCurrentUser);

export async function getUserFromDB(id: string) {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.id, id),
    columns: {
      id: true,
      role: true,
      banned: true,
      email: true,
      name: true,
    },
  });
  if (user == null) throw new Error("User not found in DB");

  return user;
}

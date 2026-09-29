"use server";

import { getCurrentUser, getUserFromDB } from "@/auth/currentUser";
import { TReserveStatus } from "@/drizzle/schema";
import {
  insertReserve as insertReserveDB,
  updateReserve as updateReserveDB,
} from "../db/reserve";
import { getUserActivePlan } from "@/features/plans/db/uesrPlan/userPlan";
import { canInsertReserve, canUpdateReserve } from "../permission/reserve";
import { getBookEntity } from "@/features/book/db/book";
import { db } from "@/drizzle/db";

export async function insertReserve({
  bookId,
  userId,
}: {
  bookId: string;
  userId: string;
}) {
  const user = await getUserFromDB(userId);
  const userActivePlans = await getUserActivePlan(userId);

  if (!(userActivePlans.length > 0) || !canInsertReserve(user))
    return {
      error: true,
      message: "This user doesn't have permission to insert reserve.",
    };

  const [bookEntity] = await getBookEntity(bookId);

  if (bookEntity == null) throw new Error("There is no book with this id.");

  if (bookEntity.availableCount < 1)
    return { error: true, message: "Sorry the book is not available." };

  const existingReserve = await db.query.reserveTable.findFirst({
    where: (reserve, { and, eq, inArray }) =>
      and(
        eq(reserve.bookId, bookId),
        eq(reserve.userId, userId),
        inArray(reserve.status, ["pending", "active"]),
      ),
  });

  if (existingReserve) {
    return {
      error: true,
      message: "You already have a pending or active reserve for this book.",
    };
  }

  await insertReserveDB({ bookId, userId });
  return { error: false, message: "Book reserved succesfully." };
}

export async function updateReserve({
  reserveId,
  status,
}: {
  reserveId: string;
  status: TReserveStatus;
}) {
  const user = await getCurrentUser({});
  if (user == null) throw new Error("There is no user logged in.");
  if (!canUpdateReserve(user))
    throw new Error("You don't have permission to update reserve.");

  await updateReserveDB({ reserveId, status });
  return { error: false, message: "Reserve updated successfully" };
}

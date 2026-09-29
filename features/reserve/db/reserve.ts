import { db } from "@/drizzle/db";
import { reserveTable, TReserveStatus } from "@/drizzle/schema";
import { revalidateReserveCache } from "./cache";
import { revalidateTag } from "next/cache";
import { getBookTag, getUserTag } from "@/lib/cacheTag";
import { revalidateBookCache } from "@/features/book/db/cache";
import { desc, eq } from "drizzle-orm";

export async function insertReserve({
  bookId,
  userId,
}: {
  bookId: string;
  userId: string;
}) {
  const [insertedReserve] = await db
    .insert(reserveTable)
    .values({ bookId, userId })
    .returning();

  if (insertedReserve == null) throw new Error("Failed to insert reserve.");

  revalidateReserveCache(insertedReserve.id);
  revalidateTag(getUserTag("reserve", userId), { expire: 0 });
  revalidateBookCache(bookId);

  return insertedReserve;
}

export async function updateReserve({
  reserveId,
  status,
}: {
  reserveId: string;
  status: TReserveStatus;
}) {
  const [updatedReserve] = await db
    .update(reserveTable)
    .set({ status, returnedAt: status == "returned" ? new Date() : null })
    .where(eq(reserveTable.id, reserveId))
    .returning();

  if (updatedReserve == null) throw new Error("Failed to update reserve.");

  revalidateReserveCache(updatedReserve.id);
  revalidateTag(getUserTag("reserve", updatedReserve.userId), { expire: 0 });
  revalidateTag(getBookTag("reserve", updatedReserve.bookId), { expire: 0 });

  return updatedReserve;
}

export async function getReserves({ userId }: { userId?: string }) {
  return db.query.reserveTable.findMany({
    where: userId ? eq(reserveTable.userId, userId) : undefined,

    columns: {
      id: true,
      status: true,
      createdAt: true,
      returnedAt: true,
    },

    with: {
      book: {
        columns: {
          title: true,
          id: true,
          imagePath: true,
        },
      },

      user: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
    },

    orderBy: [desc(reserveTable.createdAt)],
  });
}

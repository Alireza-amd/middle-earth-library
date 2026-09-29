import { db } from "@/drizzle/db";
import { bookCategoryTable } from "@/drizzle/schema";
import { getBookTag } from "@/lib/cacheTag";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export async function insertBookCategory(
  bookId: string,
  categoryId: string,
  trx: Omit<typeof db, "$client"> = db
) {
  const [insertedBookCategory] = await trx
    .insert(bookCategoryTable)
    .values({ bookId, categoryId })
    .onConflictDoNothing()
    .returning();

  if (insertedBookCategory == null)
    throw new Error("Failed to insert book category.");

  revalidateTag(getBookTag("category", bookId), { expire: 0 });
  return insertedBookCategory;
}

export async function updateBookCategory(
  bookId: string,
  categoryIds: string[],
  trx: Omit<typeof db, "$client"> = db
) {
  await trx
    .delete(bookCategoryTable)
    .where(eq(bookCategoryTable.bookId, bookId));

  await Promise.all(
    categoryIds.map((categoryId) => insertBookCategory(bookId, categoryId, trx))
  );

  revalidateTag(getBookTag("category", bookId), { expire: 0 });
}

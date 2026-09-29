import { db } from "@/drizzle/db";
import {
  bookTable,
  reserveTable,
  UNAVAILABLE_BOOK_STATUSES,
} from "@/drizzle/schema";
import { revalidateBookCache } from "./cache";
import { eq, sql } from "drizzle-orm";

export async function insertBook(
  data: typeof bookTable.$inferInsert,
  trx: Omit<typeof db, "$client"> = db
) {
  const [insertedBook] = await trx.insert(bookTable).values(data).returning();

  if (insertedBook == null) throw new Error("Failed to insert book in DB.");

  revalidateBookCache(insertedBook.id);
  return insertedBook;
}

export async function updateBook(
  id: string,
  data: Partial<typeof bookTable.$inferInsert>,
  trx: Omit<typeof db, "$client"> = db
) {
  const [updatedBook] = await trx
    .update(bookTable)
    .set(data)
    .where(eq(bookTable.id, id))
    .returning();

  if (updatedBook == null) throw new Error("Failed to update book from DB.");

  revalidateBookCache(updatedBook.id);
  return updatedBook;
}

export async function deleteBook(
  id: string,
  trx: Omit<typeof db, "$client"> = db
) {
  const [deletedBook] = await trx
    .delete(bookTable)
    .where(eq(bookTable.id, id))
    .returning();

  if (deletedBook == null) throw new Error("Failed to delete book from DB.");

  revalidateBookCache(deletedBook.id);
  return deletedBook;
}

export async function getBookEntity(bookId: string) {
  return await db
    .select({
      id: bookTable.id,
      entity: bookTable.entity,
      availableCount: sql<number>`
      ${bookTable.entity}-COUNT(CASE 
        WHEN ${reserveTable.status} IN ${sql.raw(`('${UNAVAILABLE_BOOK_STATUSES.join("','")}')`)}
        THEN ${reserveTable.id} 
      END)
    `,
    })
    .from(bookTable)
    .where(eq(bookTable.id, bookId))
    .leftJoin(reserveTable, eq(reserveTable.bookId, bookId))
    .groupBy(bookTable.id)
    .limit(1);
}

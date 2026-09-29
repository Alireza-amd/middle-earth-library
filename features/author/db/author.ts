import { db } from "@/drizzle/db";
import { authorTable } from "@/drizzle/schema";
import { revalidateAuthorCache } from "./cache";
import { eq } from "drizzle-orm";

export async function insertAuthor(data: typeof authorTable.$inferInsert) {
  const [insertedAuthor] = await db
    .insert(authorTable)
    .values(data)
    .returning();

  if (insertedAuthor == null) throw new Error("Failed to insert author to db.");

  revalidateAuthorCache(insertedAuthor.id);
  return insertAuthor;
}

export async function updateAuthor(
  id: string,
  data: Partial<typeof authorTable.$inferInsert>
) {
  const [updatedAuthor] = await db
    .update(authorTable)
    .set(data)
    .where(eq(authorTable.id, id))
    .returning();

  if (updatedAuthor == null) throw new Error("Failed to update author in db.");

  revalidateAuthorCache(updatedAuthor.id);
  return updatedAuthor;
}

export async function deleteAuthor(id: string) {
  const [deletedAuthor] = await db
    .delete(authorTable)
    .where(eq(authorTable.id, id))
    .returning();

  if (deletedAuthor == null)
    throw new Error("Failed to delete author from DB.");

  revalidateAuthorCache(deletedAuthor.id);
  return deletedAuthor;
}

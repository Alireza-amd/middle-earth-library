import { db } from "@/drizzle/db";
import { categoryTable } from "@/drizzle/schema";
import { revalidateCategoryCache } from "./cache";
import { eq } from "drizzle-orm";

export async function insertCategory(data: typeof categoryTable.$inferInsert) {
  const [insertedCategory] = await db
    .insert(categoryTable)
    .values(data)
    .returning();

  if (insertedCategory == null)
    throw new Error("Failed to insert category to db.");

  revalidateCategoryCache(insertedCategory.id);
  return insertCategory;
}

export async function updateCategory(
  id: string,
  data: Partial<typeof categoryTable.$inferInsert>
) {
  const [updatedCategory] = await db
    .update(categoryTable)
    .set(data)
    .where(eq(categoryTable.id, id))
    .returning();

  if (updatedCategory == null)
    throw new Error("Failed to update category in db.");

  revalidateCategoryCache(updatedCategory.id);
  return updatedCategory;
}

export async function deleteCategory(id: string) {
  const [deletedCategory] = await db
    .delete(categoryTable)
    .where(eq(categoryTable.id, id))
    .returning();

  if (deletedCategory == null)
    throw new Error("Failed to delete category from DB.");

  revalidateCategoryCache(deletedCategory.id);
  return deletedCategory;
}

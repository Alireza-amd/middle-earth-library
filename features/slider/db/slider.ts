import { db } from "@/drizzle/db";
import { sliderTable } from "@/drizzle/schema";
import { getSliderGlobalTag, revalidateSliderCache } from "./cache";
import { eq } from "drizzle-orm";
import { cacheTag, revalidatePath } from "next/cache";

export async function insertSlider(data: typeof sliderTable.$inferInsert) {
  const [insertedSlider] = await db
    .insert(sliderTable)
    .values(data)
    .returning();

  if (insertedSlider == null) throw new Error("Failed to insert slider in DB.");

  revalidateSliderCache(insertedSlider.id);

  return insertedSlider;
}

export async function updateSlider(
  id: string,
  data: Partial<typeof sliderTable.$inferInsert>,
) {
  const [updatedSlider] = await db
    .update(sliderTable)
    .set(data)
    .where(eq(sliderTable.id, id))
    .returning();

  if (updatedSlider == null) throw new Error("Failed to update slider in DB.");

  revalidateSliderCache(updatedSlider.id);

  return updatedSlider;
}

export async function deleteSlider(id: string) {
  const [deletedSlider] = await db
    .delete(sliderTable)
    .where(eq(sliderTable.id, id))
    .returning();

  if (deletedSlider == null)
    throw new Error("Failed to delete slider from DB.");

  revalidateSliderCache(deletedSlider.id);
  return deletedSlider;
}

export async function getAllSliders() {
  "use cache";

  cacheTag(getSliderGlobalTag());

  return db.query.sliderTable.findMany({
    columns: {
      id: true,
      imagePath: true,
      link: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

"use server";

import z from "zod";
import { categorySchema } from "../schema/category";
import {
  canDeleteCategory,
  canInsertCategory,
  canUpdateCategory,
} from "../permission/category";
import { getCurrentUser } from "@/auth/currentUser";
import {
  insertCategory as insertAuthorDB,
  updateCategory as updateAuthorDB,
  deleteCategory as deleteAuthorDB,
} from "../db/category";

export async function insertCategory(unsafeData: z.infer<typeof categorySchema>) {
  const { success, data } = categorySchema.safeParse(unsafeData);

  if (
    !success ||
    !canInsertCategory(await getCurrentUser({ redirectIfNotFound: true }))
  )
    throw new Error("Failed to insert author.");

  await insertAuthorDB(data);
  return { error: false, message: "Author inserted succesfully." };
}

export async function updateCategory(
  id: string,
  unsafeData: z.infer<typeof categorySchema>
) {
  const { success, data } = categorySchema.safeParse(unsafeData);

  if (
    !success ||
    !canUpdateCategory(await getCurrentUser({ redirectIfNotFound: true }))
  )
    throw new Error("Failed to update author.");

  await updateAuthorDB(id, data);
  return { error: false, message: "Author updated succesfully." };
}

export async function deleteCategory(id: string) {
  if (!canDeleteCategory(await getCurrentUser({ redirectIfNotFound: true })))
    throw new Error("Don't have permission.");

  await deleteAuthorDB(id);

  return { error: false, message: "Author deleted successfully." };
}

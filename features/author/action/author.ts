"use server";

import z from "zod";
import { authorSchema } from "../schema/author";
import {
  canDeleteAuthor,
  canInsertAuthor,
  canUpdateAuthor,
} from "../permission/author";
import { getCurrentUser } from "@/auth/currentUser";
import {
  insertAuthor as insertAuthorDB,
  updateAuthor as updateAuthorDB,
  deleteAuthor as deleteAuthorDB,
} from "../db/author";

export async function insertAuthor(unsafeData: z.infer<typeof authorSchema>) {
  const { success, data } = authorSchema.safeParse(unsafeData);

  if (
    !success ||
    !canInsertAuthor(await getCurrentUser({ redirectIfNotFound: true }))
  )
    throw new Error("Failed to insert author.");

  await insertAuthorDB(data);
  return { error: false, message: "Author inserted succesfully." };
}

export async function updateAuthor(
  id: string,
  unsafeData: z.infer<typeof authorSchema>
) {
  const { success, data } = authorSchema.safeParse(unsafeData);

  if (
    !success ||
    !canUpdateAuthor(await getCurrentUser({ redirectIfNotFound: true }))
  )
    throw new Error("Failed to update author.");

  await updateAuthorDB(id, data);
  return { error: false, message: "Author updated succesfully." };
}

export async function deleteAuthor(id: string) {
  if (!canDeleteAuthor(await getCurrentUser({ redirectIfNotFound: true })))
    throw new Error("Don't have permission.");

  await deleteAuthorDB(id);

  return { error: false, message: "Author deleted successfully." };
}

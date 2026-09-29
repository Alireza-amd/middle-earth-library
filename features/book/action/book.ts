"use server";

import z from "zod";
import { bookInsertSchema, bookSchema } from "../schema/book";
import {
  canDeleteBook,
  canInsertBook,
  canUpdateBook,
} from "../permission/book";
import {
  insertBook as insertBookDB,
  updateBook as updateBookDB,
  deleteBook as deleteBookDB,
} from "../db/book";
import { getCurrentUser } from "@/auth/currentUser";
import { db } from "@/drizzle/db";
import {
  insertBookCategory as insertBookCategoryDb,
  updateBookCategory,
} from "../db/bookCategory/bookCategory";

export async function insertBook(unsafeData: z.infer<typeof bookInsertSchema>) {
  const result = bookInsertSchema.safeParse(unsafeData);

  if (!result.success)
    return {
      error: true,
      message: "Invalid book data.",
    };

  const data = result.data;

  if (
    !canInsertBook(
      await getCurrentUser({
        redirectIfNotFound: true,
      }),
    )
  ) {
    return {
      error: true,
      message: "Permission denied.",
    };
  }

  await db.transaction(async (trx) => {
    const { categoryIds, ...bookData } = data;

    const insertedBook = await insertBookDB(bookData, trx);

    await Promise.all(
      categoryIds.map((categoryId) =>
        insertBookCategoryDb(insertedBook.id, categoryId, trx),
      ),
    );
  });

  return {
    error: false,
    message: "Book inserted successfully.",
  };
}

export async function updateBook(
  id: string,
  unsafeData: z.infer<typeof bookSchema>,
) {
  const result = bookSchema.safeParse(unsafeData);

  if (!result.success) {
    return {
      error: true,
      message: "Invalid book data.",
    };
  }

  const data = result.data;

  if (
    !canUpdateBook(
      await getCurrentUser({
        redirectIfNotFound: true,
      }),
    )
  ) {
    return {
      error: true,
      message: "Permission denied.",
    };
  }

  await db.transaction(async (trx) => {
    const { categoryIds, ...bookData } = data;

    await updateBookDB(
      id,
      {
        title: bookData.title,
        desc: bookData.desc,
        isbn: bookData.isbn,
        entity: bookData.entity,
        authorId: bookData.authorId,
        imagePath: bookData.imagePath,
      },
      trx,
    );

    await updateBookCategory(id, categoryIds, trx);
  });

  return {
    error: false,
    message: "Book updated successfully.",
  };
}

export async function deleteBook(id: string) {
  if (
    !canDeleteBook(
      await getCurrentUser({
        redirectIfNotFound: true,
      }),
    )
  ) {
    return {
      error: true,
      message: "Permission denied.",
    };
  }

  await deleteBookDB(id);

  return {
    error: false,
    message: "Book deleted successfully.",
  };
}

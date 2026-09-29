import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { bookTable } from "./book";
import { categoryTable } from "./category";
import { createdAt, updatedAt } from "../schema-helper";
import { relations } from "drizzle-orm";

export const bookCategoryTable = pgTable(
  "book_category",
  {
    bookId: uuid()
      .notNull()
      .references(() => bookTable.id, { onDelete: "cascade" }),
    categoryId: uuid()
      .notNull()
      .references(() => categoryTable.id, { onDelete: "cascade" }),
    createdAt,
    updatedAt,
  },
  (t) => [primaryKey({ columns: [t.bookId, t.categoryId] })]
);

export const bookCategoryRelationships=relations(bookCategoryTable,({one})=>({
    book:one(bookTable,{
        fields:[bookCategoryTable.bookId],
        references:[bookTable.id]
    }),
    category:one(categoryTable,{
        fields:[bookCategoryTable.categoryId],
        references:[categoryTable.id]
    })
}))
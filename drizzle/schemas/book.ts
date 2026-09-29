import { pgTable, text, integer, varchar, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schema-helper";
import { authorTable } from "./author";
import { relations } from "drizzle-orm";
import { bookCategoryTable } from "./bookCategory";
import { reserveTable } from "./reserve";
import { commentTable } from "./comments";

export const bookTable = pgTable("books", {
  id,
  title: text().notNull(),
  desc: text().notNull(),
  isbn: varchar({ length: 13 }).notNull(),
  imagePath: varchar().notNull(),
  entity: integer().notNull(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => authorTable.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});

export const bookRelationships = relations(bookTable, ({ one, many }) => ({
  author: one(authorTable, {
    fields: [bookTable.authorId],
    references: [authorTable.id],
  }),
  bookCategories: many(bookCategoryTable),
  reserves: many(reserveTable),
  comments: many(commentTable),
}));

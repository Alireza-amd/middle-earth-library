import { boolean, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schema-helper";
import { userTable } from "./user";
import { bookTable } from "./book";
import { relations } from "drizzle-orm";
import { commentLikesTable } from "./commentLikes";

export const commentTable = pgTable("comments", {
  id,
  userId: uuid()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  bookId: uuid()
    .notNull()
    .references(() => bookTable.id, { onDelete: "cascade" }),
  parentId: uuid().references((): any => commentTable.id, {
    onDelete: "cascade",
  }),
  content: text().notNull(),
  likes: integer().notNull().default(0),
  dislikes: integer().notNull().default(0),
  spoiler: boolean().notNull(),
  createdAt,
  updatedAt,
});

export const commentRelationships = relations(
  commentTable,
  ({ one, many }) => ({
    user: one(userTable, {
      fields: [commentTable.userId],
      references: [userTable.id],
    }),
    book: one(bookTable, {
      fields: [commentTable.bookId],
      references: [bookTable.id],
    }),
    parent: one(commentTable, {
      fields: [commentTable.parentId],
      references: [commentTable.id],
    }),
    commentLikes: many(commentLikesTable),
  }),
);

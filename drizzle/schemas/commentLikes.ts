import { boolean, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { userTable } from "./user";
import { commentTable } from "./comments";
import { createdAt, updatedAt } from "../schema-helper";
import { relations } from "drizzle-orm";

export const commentLikesTable = pgTable(
  "comment_likes",
  {
    commentId: uuid()
      .notNull()
      .references(() => commentTable.id, { onDelete: "cascade" }),
    userId: uuid()
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    like: boolean().notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [primaryKey({ columns: [table.commentId, table.userId] })],
);

export const commentLikesRelationship = relations(
  commentLikesTable,
  ({ one }) => ({
    comment: one(commentTable, {
      fields: [commentLikesTable.commentId],
      references: [commentTable.id],
    }),
    user: one(userTable, {
      fields: [commentLikesTable.userId],
      references: [userTable.id],
    }),
  }),
);

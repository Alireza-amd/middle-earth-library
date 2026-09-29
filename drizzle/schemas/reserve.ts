import { addMonths } from "date-fns";
import { pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schema-helper";
import { userTable } from "./user";
import { bookTable } from "./book";
import { relations } from "drizzle-orm";

export const reserveStatus = [
  "active",
  "returned",
  "pending",
  "overdue",
  "cancelled",
] as const;
export type TReserveStatus = (typeof reserveStatus)[number];
export const UNAVAILABLE_BOOK_STATUSES = [
  "active",
  "overdue",
  "pending",
] as const;
export const reserveStatusEnum = pgEnum("reserve_status", reserveStatus);

export const reserveTable = pgTable("book_reservation", {
  id,
  userId: uuid()
    .notNull()
    .references(() => userTable.id, { onDelete: "restrict" }),
  bookId: uuid()
    .notNull()
    .references(() => bookTable.id),
  dueDate: timestamp("due_date", { withTimezone: true })
    .notNull()
    .$default(() => {
      return addMonths(Date.now(), 1);
    }),
  returnedAt: timestamp("returned_at"),
  status: reserveStatusEnum().notNull().default("pending"),
  createdAt,
  updatedAt,
});

export const reserveRelationships = relations(reserveTable, ({ one }) => ({
  user: one(userTable, {
    fields: [reserveTable.userId],
    references: [userTable.id],
  }),
  book: one(bookTable, {
    fields: [reserveTable.bookId],
    references: [bookTable.id],
  }),
}));

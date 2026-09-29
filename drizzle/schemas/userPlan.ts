import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schema-helper";
import { userTable } from "./user";
import { planTable } from "./plan";
import { relations } from "drizzle-orm";

export const userPlanTable = pgTable("user_plans", {
  id,
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  planId: uuid("plan_id")
    .notNull()
    .references(() => planTable.id, { onDelete: "cascade" }),
  endAt: timestamp({ withTimezone: true }).notNull(),
  createdAt,
  updatedAt,
});

export const userPlanRelationships = relations(userPlanTable, ({ one }) => ({
  user: one(userTable, {
    fields: [userPlanTable.userId],
    references: [userTable.id],
  }),
  plan: one(planTable, {
    fields: [userPlanTable.planId],
    references: [planTable.id],
  }),
}));

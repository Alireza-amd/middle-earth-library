import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schema-helper";
import { relations } from "drizzle-orm";
import { userPlanTable } from "./userPlan";

export const planTable = pgTable("plans", {
  id,
  title: text().notNull(),
  durationMonth: integer("duration_month").notNull(),
  priceInRials: integer("price_in_rials").notNull(),
  active: boolean()
    .$default(() => true)
    .notNull(),
  createdAt,
  updatedAt,
});

export const planRelationships = relations(planTable, ({ many }) => ({
  userPlans: many(userPlanTable),
}));

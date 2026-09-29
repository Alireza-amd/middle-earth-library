import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schema-helper";
import { userPlanTable } from "./userPlan";
import { relations } from "drizzle-orm";

export const purchaseTable = pgTable("purchases", {
  id,
  pricePaidInRials: integer("price_paid_in_rials").notNull(),
  userPlanId: uuid()
    .notNull()
    .references(() => userPlanTable.id),
  zarinPalPurchaseId: text("zarin_pal_purchase_id").notNull(),
  createdAt,
  updatedAt,
});

export const purchaseRelationships = relations(purchaseTable, ({ one }) => ({
  userPlan: one(userPlanTable, {
    fields: [purchaseTable.userPlanId],
    references: [userPlanTable.id],
  }),
}));

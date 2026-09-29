import { boolean, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schema-helper";
import { relations } from "drizzle-orm";
import { oAuthAccountTable } from "./oAuthAccounts";
import { userPlanTable } from "./userPlan";
import { reserveTable } from "./reserve";
import { commentTable } from "./comments";

export const userRoles = ["admin", "user"] as const;
export type TUserRoles = (typeof userRoles)[number];
export const userRolesEnum = pgEnum("user_roles", userRoles);

export const userTable = pgTable("users", {
  id,
  name: text().notNull(),
  email: text().notNull().unique(),
  salt: text(),
  hashedPassword: text(),
  role: userRolesEnum()
    .$default(() => "user")
    .notNull(),
  banned: boolean()
    .$default(() => false)
    .notNull(),
  createdAt,
  updatedAt,
});

export const userRelationships = relations(userTable, ({ many }) => ({
  oAuthAccounts: many(oAuthAccountTable),
  userPlans: many(userPlanTable),
  reserves: many(reserveTable),
  comments: many(commentTable),
}));

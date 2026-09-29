import { pgEnum, pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";
import { userTable } from "./user";
import { createdAt, updatedAt } from "../schema-helper";
import { relations } from "drizzle-orm";

export const providers = ["github", "google"] as const;
export type TProviders = (typeof providers)[number];
export const providersEnum = pgEnum("provider", providers);

export const oAuthAccountTable = pgTable(
  "o_auth_accounts",
  {
    userId: uuid()
      .references(() => userTable.id, { onDelete: "cascade" })
      .notNull(),
    provider: providersEnum().notNull(),
    providerId: text("provider_id").notNull(),
    createdAt,
    updatedAt,
  },
  (t) => [primaryKey({ columns: [t.providerId, t.provider] })]
);

export const oAuthAccountRelationships = relations(
  oAuthAccountTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [oAuthAccountTable.userId],
      references: [userTable.id],
    }),
  })
);

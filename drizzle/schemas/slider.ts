import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schema-helper";

export const sliderTable = pgTable("sliders", {
  id,
  imagePath: varchar().notNull(),
  link: varchar().notNull(),
  createdAt,
  updatedAt,
});

export const sliderRelationships = {};

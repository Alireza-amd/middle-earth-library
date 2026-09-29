import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schema-helper";
import { relations } from "drizzle-orm";
import { bookTable } from "./book";

export const authorTable=pgTable("authors",{
    id,
    name:text().notNull(),
    description:text().notNull(),
    createdAt,
    updatedAt
})

export const authorRelationships=relations(authorTable,({many})=>({
    books:many(bookTable)
}))
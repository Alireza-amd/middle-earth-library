import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schema-helper";
import { relations } from "drizzle-orm";
import { bookCategoryTable } from "./bookCategory";

export const categoryTable=pgTable("categories",{
    id,
    title:text().notNull(),
    createdAt,
    updatedAt
})

export const categoryRelationships=relations(categoryTable,({many})=>({
    bookCategories:many(bookCategoryTable)
}))
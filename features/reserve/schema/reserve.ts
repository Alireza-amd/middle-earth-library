import z from "zod";

export const reserveSchema=z.object({
    userId:z.string().min(1,"User ID must not be empty"),
    bookId:z.string().min(1,"Book ID must not be empty")
})
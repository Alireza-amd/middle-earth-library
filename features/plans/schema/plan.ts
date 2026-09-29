import z from "zod";

export const planSchema=z.object({
    title:z.string().min(1,"Plan must container name."),
    durationMonth:z.number(),
    priceInRials:z.number(),
    active:z.boolean()
})
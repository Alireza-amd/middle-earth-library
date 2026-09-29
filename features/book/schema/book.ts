import z from "zod";

export const bookSchema = z.object({
  title: z.string().min(1, "Title must not be empty."),
  desc: z.string().min(1, "Description must not be empty."),
  isbn: z.string().length(13, "ISBN is 13 characters."),
  entity: z.int().min(1),
  authorId: z.string().min(1),
  imagePath: z.string().optional(),
  categoryIds: z.array(z.string().min(1)),
});

export const bookInsertSchema = z.object({
  title: z.string().min(1),
  desc: z.string().min(1),
  isbn: z.string().length(13),
  entity: z.number().min(1),
  authorId: z.string().min(1),
  imagePath: z.string().min(1),
  categoryIds: z.array(z.string().min(1)),
});

export type BookInsertInput = z.infer<typeof bookInsertSchema>;

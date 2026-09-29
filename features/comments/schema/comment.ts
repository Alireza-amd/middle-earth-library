import z from "zod";

export const commentSchema = z.object({
  parentId: z
    .string()
    .transform((v) => (v === "" ? null : v))
    .nullable(),
  content: z.string(),
  spoiler: z.boolean(),
});

export const insertCommentSchema = z.object({
  parentId: z.uuid().nullable(),
  userId: z.uuid(),
  bookId: z.uuid(),
  content: z.string(),
  spoiler: z.boolean(),
});

import z from "zod";

export const authorSchema = z.object({
  name: z.string().min(1, "Author must have a name"),
  description: z.string().min(1, "Author must have description"),
});

import z from "zod";

export const sliderSchema = z.object({
  imagePath: z.string().min(1, "Image path must not be empty."),
  link: z.string().url("Link must be a valid URL."),
});

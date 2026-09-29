import z from "zod";

export const signInSchema = z.object({
  email: z.email("You must enter email."),
  password: z.string().min(8, "Password must atleast contain 8 characters."),
});

export type TStepOneSignUp=z.infer<typeof stepOneSignUpSchema>
export const stepOneSignUpSchema = z
  .object({
    email: z.email("You must enter email."),
    password: z.string().min(8, "Password must atleast contain 8 characters."),
    confirmPassword: z.string().min(8, "Password must atleast contain 8 characters."),
    name:z.string().min(1,"Name should be atleast 8 characters.")
  })
  .refine((data) => data.password == data.confirmPassword, {
    message: "Password and confirm password are'nt match.",
    path: ["confirmPassword"],
  });

export const stepTwoSignUpSchema =z.object({
  code: z
    .string()
    .min(6, "Code must contain 6 characters.")
    .max(6, "Code must contain 6 characters."),
})

export const signUpSchema=stepOneSignUpSchema.merge(stepTwoSignUpSchema)
export type TSignUpSchema=z.infer<typeof signUpSchema>
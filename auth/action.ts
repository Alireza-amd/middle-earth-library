"use server";

import z from "zod";
import {
  signInSchema,
  stepOneSignUpSchema,
  signUpSchema,
  TSignUpSchema,
} from "./schema";
import { redirect } from "next/navigation";
import { insertUser, getUserByEmail } from "./db";
import { createUserSession, deleteUserSession } from "./session";
import {
  syncVerficationCode,
  generateVerficationCode,
  getVerficationCodeFromDB,
  deleteVerficationCode,
} from "./verficationCode";
import { sendEmail } from "@/nodemailer/nodemailer";
import { comparePassword } from "./passwordHasher";
import { TProviders } from "@/drizzle/schema";
import { createOAuthClient } from "./oauth/base";
import { cookies } from "next/headers";
import { refresh, revalidatePath, revalidateTag } from "next/cache";
import { CURRENT_USER_CACHE_TAG } from "./currentUser";
import { getUserActivePlan } from "@/features/plans/db/uesrPlan/userPlan";

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {
  const { success, data } = signInSchema.safeParse(unsafeData);

  if (!success) return "Invalid data.";

  const user = await getUserByEmail(data.email);

  if (user == null) return "There is no user with this email.";
  if (user.salt == null || user.hashedPassword == null)
    return "You don't have password. Try oauth providers.";

  const isPasswordCorrect = await comparePassword({
    salt: user.salt,
    password: data.password,
    hashedPassword: user.hashedPassword,
  });

  if (!isPasswordCorrect) return "Invalid Password.";

  const userActivePlans = await getUserActivePlan(user.id);
  await createUserSession({
    ...user,
    activePlan: userActivePlans.length > 0 ? userActivePlans[0].endAt : null,
    banned: user.banned,
  });

  redirect("/");
}

export async function signUpStep_1(
  unsafeData: z.infer<typeof stepOneSignUpSchema>,
) {
  const { success, data } = stepOneSignUpSchema.safeParse(unsafeData);

  if (!success) return { success: false, message: "Invalid data." };

  if (await getUserByEmail(data.email))
    return {
      success: false,
      message: "Sorry !. There is a user with this email.",
    } as const;

  return {
    success: true,
    message: "Inserted data are valid.",
  };
}

export async function signUpStep_2(unsafeData: TSignUpSchema) {
  const { success, data } = signUpSchema.safeParse(unsafeData);

  if (!success) return "Invalid Data.";

  const code = await getVerficationCodeFromDB();

  if (data.code == code) {
    const user = await insertUser(data);
    await createUserSession({ ...user, activePlan: null });
    await deleteVerficationCode();
    redirect("/");
  }

  return "You entered wrong code.";
}

export async function sendVerficationCode(email: string) {
  const code = generateVerficationCode();

  await sendEmail({ to: email, code: code });

  await syncVerficationCode(code);
  console.log(code);
}

export async function signOut() {
  try {
    await deleteUserSession();
  } catch (error) {
    console.error(error);
    return { error: true, message: "Failed to Signout." };
  }

  revalidateTag(CURRENT_USER_CACHE_TAG, { expire: 0 });
  return { error: false, message: "User Signed out succesfully." };
}

export async function redirectToOAuthProvider(provider: TProviders) {
  const clientCookies = await cookies();
  redirect(
    await createOAuthClient(provider).createAuthorizationURL(clientCookies),
  );
}

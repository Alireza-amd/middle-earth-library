import { db } from "@/drizzle/db";
import { userTable } from "@/drizzle/schema";
import { TStepOneSignUp } from "./schema";
import { eq } from "drizzle-orm";
import { generateRandomBytes, hashPssword } from "./passwordHasher";

export async function insertUser({ name, email, password }: TStepOneSignUp) {
  const salt = generateRandomBytes(64);
  const hashedPassword = await hashPssword(password, salt);

  const [user] = await db
    .insert(userTable)
    .values({
      name,
      email,
      hashedPassword,
      salt,
    })
    .returning();

  return user;
}

export async function getUserByEmail(email: string) {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.email, email),
    columns: {
      id: true,
      email: true,
      hashedPassword: true,
      salt: true,
      role: true,
      banned: true,
    },
  });

  return user;
}

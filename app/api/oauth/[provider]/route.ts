import { createOAuthClient } from "@/auth/oauth/base";
import { oAuthAccountTable, providers, TProviders } from "@/drizzle/schema";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { userTable } from "@/drizzle/schema";
import z from "zod";
import { db } from "@/drizzle/db";
import { revalidateTag } from "next/cache";
import { getUserGlobalTag } from "@/features/user/db/cache";
import { createUserSession } from "@/auth/session";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getUserActivePlan } from "@/features/plans/db/uesrPlan/userPlan";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider: rawProvider } = await params;
  const provider = z.enum(providers).parse(rawProvider);

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  // oAuthError
  if (code == null || state == null)
    redirect(
      `/sign-in?oAuthError=${encodeURIComponent("Missing code or state.")}`,
    );

  try {
    const userInfo = await createOAuthClient(provider).fetchUser(
      code,
      state,
      await cookies(),
    );
    const user = await connectUserToAccount(provider, userInfo);
    if (user == null) throw new Error("It's our fault");

    const userActivePlans = await getUserActivePlan(user.id);
    await createUserSession({
      id: user.id,
      role: user.role,
      activePlan: userActivePlans.length > 0 ? userActivePlans[0].endAt : null,
      banned: false,
    });
  } catch (error) {
    console.error(error);
    redirect(
      `/sign-in?oAuthError=${encodeURIComponent("Failed to connect. Please try again later.")}`,
    );
  }
  return NextResponse.redirect(new URL("/", request.url));
}

async function connectUserToAccount(
  provider: TProviders,
  {
    id,
    name,
    email,
  }: {
    id: string | number;
    name: string;
    email: string;
  },
) {
  return await db.transaction(async (trx) => {
    try {
      let user = await trx.query.userTable.findFirst({
        where: eq(userTable.email, email),
        columns: { id: true, role: true, banned: true },
      });
      if (user == null) {
        const [newUser] = await insertUser(trx, {
          email,
          name,
        });
        user = newUser;
      }

      await trx
        .insert(oAuthAccountTable)
        .values({ userId: user.id, provider, providerId: id.toString() })
        .onConflictDoNothing();

      return user;
    } catch (error) {
      trx.rollback();
    }
  });
}

async function insertUser(
  trx: Omit<typeof db, "$client">,
  { name, email }: Pick<typeof userTable.$inferInsert, "name" | "email">,
) {
  revalidateTag(getUserGlobalTag(), "max");

  return trx
    .insert(userTable)
    .values({
      name,
      email,
    })
    .returning({
      id: userTable.id,
      role: userTable.role,
      banned: userTable.banned,
    })
    .onConflictDoUpdate({ target: userTable.email, set: { name } });
}

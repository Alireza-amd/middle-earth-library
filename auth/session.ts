import { redisClient } from "@/redis/redis";
import { generateRandomBytes } from "./passwordHasher";
import { cookies } from "next/headers";
import z from "zod";
import { userRoles } from "@/drizzle/schema";
import { getCurrentUser } from "./currentUser";
import { getUserActivePlan } from "@/features/plans/db/uesrPlan/userPlan";

const SESSION_EXPIRATION_IN_SECONDS = 7 * 24 * 60 * 60;
const USER_SESSION_KEY_COOKIES = "session_id";

const sessionSchema = z.object({
  id: z.string(),
  role: z.enum(userRoles),
  // active Plan is just for this project
  activePlan: z.coerce.date().nullable(),
  banned: z.boolean(),
});

type TSessionSchema = z.infer<typeof sessionSchema>;
export type TCookies = {
  get: (key: string) => { name: string; value: string } | undefined;
  set: (
    key: string,
    value: string,
    options: {
      expires?: number;
      httpOnly?: boolean;
      sameSite?: "lax" | "strict" | "none";
      secure?: boolean;
    },
  ) => void;
  delete: (key: string) => void;
};

export async function createUserSession(user: TSessionSchema) {
  const sessionId = generateRandomBytes(512);
  await redisClient.set(`sessionId:${sessionId}`, sessionSchema.parse(user), {
    ex: SESSION_EXPIRATION_IN_SECONDS,
  });

  await setUserSessionCookie(sessionId);
}

export async function setUserSessionCookie(sessionId: string) {
  const clientCookies = await cookies();

  clientCookies.set(USER_SESSION_KEY_COOKIES, sessionId, {
    expires: Date.now() + SESSION_EXPIRATION_IN_SECONDS * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: true,
  });
}

export async function getUserFromSession(cookies: Pick<TCookies, "get">) {
  const sessionId = cookies.get(USER_SESSION_KEY_COOKIES)?.value;

  if (sessionId == null) return null;

  return getUserSessionById(sessionId);
}

export async function getUserSessionById(sessionId: string) {
  const rawUser = await redisClient.get(`sessionId:${sessionId}`);
  const { data } = sessionSchema.safeParse(rawUser);

  return data;
}

export async function deleteUserSession() {
  const clientCookies = await cookies();

  const sessionId = clientCookies.get(USER_SESSION_KEY_COOKIES)?.value;

  if (sessionId == null) throw new Error("Session id not found.");

  await redisClient.del(`sessionId:${sessionId}`);
  clientCookies.delete(USER_SESSION_KEY_COOKIES);
}

export async function updateUserSession() {
  const user = await getCurrentUser({});

  if (user == null) throw new Error("There is no user logged in.");

  const clientCookies = await cookies();
  const sessionId = clientCookies.get(USER_SESSION_KEY_COOKIES)?.value;

  if (sessionId == null) throw new Error("There is no sessionID in cookies");

  await redisClient.del(`sessionId:${sessionId}`);
  clientCookies.delete(USER_SESSION_KEY_COOKIES);

  clientCookies.set(USER_SESSION_KEY_COOKIES, sessionId, {
    expires: Date.now() + SESSION_EXPIRATION_IN_SECONDS * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: true,
  });

  const userActivePlans = await getUserActivePlan(user.id);
  await redisClient.set(
    `sessionId:${sessionId}`,
    sessionSchema.parse({
      ...user,
      activePlan: userActivePlans.length > 0 ? userActivePlans[0].endAt : null,
    }),
    { ex: SESSION_EXPIRATION_IN_SECONDS },
  );
}

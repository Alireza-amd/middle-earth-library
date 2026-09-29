import { CURRENT_USER_CACHE_TAG } from "@/auth/currentUser";
import { db } from "@/drizzle/db";
import { planTable, userPlanTable } from "@/drizzle/schema";
import { getUserTag } from "@/lib/cacheTag";
import { addMonths } from "date-fns";
import { and, eq, gte } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export async function insertUserPlan(
  trx: Omit<typeof db, "$client"> = db,
  {
    planDuration,
    userId,
    planId,
  }: { planDuration: number; userId: string; planId: string }
) {
  const [insertedUserPlan] = await trx
    .insert(userPlanTable)
    .values({ planId, userId, endAt: addMonths(new Date(), planDuration) })
    .returning();

  if (insertedUserPlan == null) throw new Error("Failed to insert plan");

  revalidateTag(getUserTag("plan", userId), { expire: 0 });

  return insertedUserPlan;
}

export async function getUserActivePlan(userId: string) {
  return db
    .select({
      planName: planTable.title,
      endAt: userPlanTable.endAt,
    })
    .from(userPlanTable)
    .leftJoin(planTable, eq(userPlanTable.planId, planTable.id))
    .where(
      and(
        eq(userPlanTable.userId, userId),
        gte(userPlanTable.endAt, new Date())
      )
    )
    .limit(1);
}

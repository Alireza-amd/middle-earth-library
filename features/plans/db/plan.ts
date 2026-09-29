import { db } from "@/drizzle/db";
import { getPlanIdTag, revalidatePlanTag } from "./cache";
import { planTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/cache";

export async function insertPlan(data: typeof planTable.$inferInsert) {
  const [plan] = await db.insert(planTable).values(data).returning();

  if (plan == null) throw new Error("Failed to insert Plan");

  revalidatePlanTag(plan.id);
}

export async function changePlanActivation(id: string, active: boolean) {
  const [updatedPlan] = await db
    .update(planTable)
    .set({ active })
    .where(eq(planTable.id, id))
    .returning();

  if (updatedPlan == null) throw new Error("Failed to update Plan");

  revalidatePlanTag(id);
}

export async function updatePlan(
  id: string,
  data: Partial<typeof planTable.$inferInsert>
) {
  const [updatedUser] = await db
    .update(planTable)
    .set(data)
    .where(eq(planTable.id, id))
    .returning();

  if (updatedUser == null) throw new Error("Failed to updated user.");

  revalidatePlanTag(updatedUser.id);
}

export async function deletePlan(id: string) {
  const [deletedPlan] = await db
    .delete(planTable)
    .where(eq(planTable.id, id))
    .returning();

  if (deletedPlan == null) throw new Error("Failed to delete plan.");

  revalidatePlanTag(deletedPlan.id);
}

export async function getPlanById(id: string) {
  "use cache";

  const plan = await db.query.planTable.findFirst({
    where: eq(planTable.id, id),
  });

  if (plan == null) throw new Error("There is no plan with this id.");

  cacheTag(getPlanIdTag(plan.id));

  return plan;
}

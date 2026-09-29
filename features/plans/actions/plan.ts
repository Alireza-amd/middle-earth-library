"use server";

import z from "zod";
import { planSchema } from "../schema/plan";
import {
  canDeletePlan,
  canInsertPlan,
  canUpdatePlan,
} from "../permissions/plan";
import {
  insertPlan as insertPlanDB,
  updatePlan as updatePlanDB,
  deletePlan as deletePlanDB,
} from "../db/plan";
import { getCurrentUser } from "@/auth/currentUser";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { planTable } from "@/drizzle/schema";
import { changePlanActivation as changePlanActivationDB } from "../db/plan";

export async function insertPlan(unsafeData: z.infer<typeof planSchema>) {
  const { success, data } = planSchema.safeParse(unsafeData);

  if (
    !success ||
    !canInsertPlan(await getCurrentUser({ redirectIfNotFound: true }))
  )
    return { error: true, message: "Failed to insert Plan." };

  await insertPlanDB(data);
  return { error: false, message: "Plan craeted succesfully." };
}

export async function updatePlan(
  id: string,
  unsafeData: z.infer<typeof planSchema>
) {
  const { success, data } = planSchema.safeParse(unsafeData);

  if (
    !success ||
    !canUpdatePlan(await getCurrentUser({ redirectIfNotFound: true }))
  )
    return { error: true, message: "Failed to Update Plan." };

  await updatePlanDB(id, data);

  return { error: false, message: "Plan updated succesfully." };

}

export async function changePlanActivation({ id }: { id: string }) {
  const plan = await db.query.planTable.findFirst({
    where: eq(planTable.id, id),
  });

  if (
    plan == null ||
    !canUpdatePlan(await getCurrentUser({ redirectIfNotFound: true }))
  )
    return { error: true, message: "Failed to update plan" };

  await changePlanActivationDB(id, !plan.active);
  return { error: false, message: "Plan Updated Succesfully." };
}

export async function deletePlan(id: string) {
  if (!canDeletePlan(await getCurrentUser({ redirectIfNotFound: true })))
    return { error: true, message: "No access to delete plan" };

  await deletePlanDB(id);

  return { error: false, message: "Plan deleted succesfully." };
}

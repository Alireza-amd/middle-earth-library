"use server";

import { getUserActivePlan } from "@/features/plans/db/uesrPlan/userPlan";
import { getCurrentUser } from "./currentUser";

export async function fetchCurrentUser() {
  return await getCurrentUser({ getFullUser: true });
}

export async function fetchUserActivePlans(userId:string) {
  return await getUserActivePlan(userId)
}
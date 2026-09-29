import { CURRENT_USER_CACHE_TAG, getCurrentUser } from "@/auth/currentUser";
import { updateUserSession } from "@/auth/session";
import { db } from "@/drizzle/db";
import { getPlanById } from "@/features/plans/db/plan";
import { insertUserPlan } from "@/features/plans/db/uesrPlan/userPlan";
import { insertPurchase } from "@/features/purchase/db/purchase";
import { ZarinPaal } from "@/ZarinPaal/base";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ planId: string }> }
) {
  const authority = request.nextUrl.searchParams.get("Authority");
  const status = request.nextUrl.searchParams.get("Status");
  const planId = (await params).planId;

  if (planId == null || authority == null || status == null)
    throw new Error("Invalid data.");
  if (status == "NOK") return new Response("Bad request.", { status: 400 });

  const user = await getCurrentUser({});
  const plan = await getPlanById(planId);
  if (user == null) throw new Error("User not found");

  const { code, refId } = await new ZarinPaal({
    price: plan.priceInRials,
  }).authorize(authority);

  if (code !== 100) return new Response("Purchase Failed");

  await db.transaction(async (trx) => {
    try {
      const insertedUserPlan = await insertUserPlan(trx, {
        planDuration: plan.durationMonth,
        planId,
        userId: user.id,
      });
      await insertPurchase(trx, {
        userId: user.id,
        pricePaidInRials: plan.priceInRials,
        userPlanId: insertedUserPlan.id,
        zarinPalPurchaseId: refId.toString(),
      });
    } catch (error) {
      console.error(error);
      trx.rollback();
      return NextResponse.json("Purchase Failed", { status: 500 });
    }
  });

  await updateUserSession();
  revalidateTag(CURRENT_USER_CACHE_TAG, { expire: 0 });

  const redirectURL = new URL("/plans/purchased", request.nextUrl);
  redirectURL.searchParams.set(
    "message",
    encodeURIComponent("Purchased succesfully.")
  );

  return NextResponse.redirect(redirectURL);
}

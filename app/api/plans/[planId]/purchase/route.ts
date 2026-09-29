import { getCurrentUser } from "@/auth/currentUser";
import { getPlanById } from "@/features/plans/db/plan";
import { getUserActivePlan } from "@/features/plans/db/uesrPlan/userPlan";
import { ZarinPaal } from "@/ZarinPaal/base";
import { differenceInDays } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ planId?: string }> }
) {
  const planId = (await params).planId;
  const currentUser = await getCurrentUser({ redirectIfNotFound: true });

  if (currentUser.activePlan) {
    const url = new URL("/plans", request.nextUrl);
    url.searchParams.set(
      "message",
      encodeURIComponent(
        `You already have an active plan. ${differenceInDays(currentUser.activePlan, new Date())} days left.`
      )
    );
    return NextResponse.redirect(url);
  }

  if (planId == null) throw new Error("There is no plan Id");

  const plan = await getPlanById(planId);
  const callbackURL = `${request.nextUrl.toString()}/status`;
  const paymentGateway = await new ZarinPaal({
    price: plan.priceInRials,
  }).register(callbackURL);

  return NextResponse.redirect(new URL(paymentGateway));
}

import { db } from "@/drizzle/db";
import { planTable } from "@/drizzle/schema";
import { PlanForm } from "@/features/plans/components/PlanForm";
import { getPlanIdTag } from "@/features/plans/db/cache";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/cache";

export default async function UpdatePlanPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const planId = (await params).planId;
  const plan = await getPlanById(planId);
  return (
    <div className="container">
      <PlanForm plan={plan} />
    </div>
  );
}

async function getPlanById(id: string) {
  "use cache";
  const plan = await db.query.planTable.findFirst({
    where: eq(planTable.id, id),
    columns: {
      id: true,
      active: true,
      durationMonth: true,
      priceInRials: true,
      title: true,
    },
  });

  if (plan == null) throw new Error("Plan not found.");

  cacheTag(getPlanIdTag(plan.id));

  return plan;
}

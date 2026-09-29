import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActionButton } from "@/components/ActionButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { changePlanActivation, deletePlan } from "../actions/plan";
import { cacheTag } from "next/cache";
import { getPlanGlobalTag } from "../db/cache";
import { db } from "@/drizzle/db";
import { planTable, userPlanTable } from "@/drizzle/schema";
import { count, eq } from "drizzle-orm";
import { formatPlurals } from "@/lib/formatters";
import { PlanFormDialog } from "./PlanformDialog";

export async function PlansTable() {
  const plans = await getAllPlans();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            {formatPlurals(plans.length, { plural: "plans", singular: "plan" })}
          </TableHead>
          <TableHead>Duration months</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="w-[100px]">Status</TableHead>
          <TableHead>Customers</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {plans &&
          plans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell>{plan.title}</TableCell>
              <TableCell>{plan.durationMonth}</TableCell>
              <TableCell>{plan.priceInRials}</TableCell>
              <TableCell>{plan.active ? "Active" : "Disable"}</TableCell>
              <TableCell>{plan.customersCount}</TableCell>
              <TableCell>
                <div className="grid grid-cols-3 gap-3 w-[300px]">
                  <ActionButton
                    variant="destructive"
                    action={deletePlan.bind(null, plan.id)}
                    requiredAreYouSure={true}
                  >
                    Delete
                  </ActionButton>
                  <ActionButton
                    action={changePlanActivation.bind(null, {
                      id: plan.id,
                      active: plan.active,
                    })}
                  >
                    {plan.active ? "Active" : "Disactive"}
                  </ActionButton>
                  {/* <Button asChild>
                    <Link href={`/admin/plans/${plan.id}`}>UpdatePlan</Link>
                  </Button> */}
                  <PlanFormDialog plan={plan} />
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

async function getAllPlans() {
  "use cache";

  cacheTag(getPlanGlobalTag());

  return db
    .select({
      id: planTable.id,
      active: planTable.active,
      durationMonth: planTable.durationMonth,
      priceInRials: planTable.priceInRials,
      title: planTable.title,
      customersCount: count(userPlanTable.planId),
    })
    .from(planTable)
    .leftJoin(userPlanTable, eq(planTable.id, userPlanTable.planId))
    .orderBy(planTable.durationMonth)
    .groupBy(planTable.id);
}

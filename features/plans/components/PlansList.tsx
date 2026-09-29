import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardSkeleton } from "@/components/Skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cacheTag } from "next/cache";
import { getPlanGlobalTag } from "../db/cache";
import { db } from "@/drizzle/db";
import { asc, eq } from "drizzle-orm";
import { planTable } from "@/drizzle/schema";
import { formatPrice } from "@/lib/formatters";

export async function PlansList({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const message = (await searchParams).message;
  const plans = await getAllPlans();

  return (
    <>
      {message && (
        <div className="font-pop my-3 text-xl text-green-600 bg-green-200 p-2">
          {decodeURIComponent(message)}
        </div>
      )}
      <div className="grid lg:grid-cols-3 grid-cols-1 md:grid-cols-2 gap-4">
        {plans &&
          plans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle>{plan.title}</CardTitle>
                <CardDescription>
                  {formatPrice(plan.priceInRials)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is a plan for {plan.durationMonth} months.</p>
              </CardContent>
              <CardFooter>
                <div className="flex gap-2">
                  <Button variant="secondary" asChild>
                    <Link href={`/api/plans/${plan.id}/purchase`}>
                      Purchase
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
      </div>
    </>
  );
}

export function PlansListSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 md:grid-cols-2 gap-4 container">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

async function getAllPlans() {
  "use cache";

  cacheTag(getPlanGlobalTag());

  return db.query.planTable.findMany({
    where: eq(planTable.active, true),
    columns: {
      id: true,
      durationMonth: true,
      priceInRials: true,
      title: true,
    },
    orderBy: [asc(planTable.durationMonth)],
  });
}

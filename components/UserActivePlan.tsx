"use client";

import { getUserTag } from "@/lib/cacheTag";
import { useQuery } from "@tanstack/react-query";
import { differenceInDays } from "date-fns";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";
import { fetchUserActivePlans } from "@/auth/clientCurrentUser";

export function UserActivePlan({ id }: { id: string }) {
  const userActivePlan = useQuery({
    queryKey: [getUserTag("plan", id)],
    queryFn: async () => fetchUserActivePlans(id),
  });

  if (userActivePlan.isLoading) return <h1>Loading..</h1>;
  if (userActivePlan.isError) return <h1>Error</h1>;

  const plans = userActivePlan.data ?? [];
  if (plans.length === 0)
    return (
      <div className="flex flex-col gap-2 items-center bg-blue-50 p-2">
        <h1>You don't have active plan.</h1>
        <Link href="/plans" className="hover:underline underline-offset-2">
          Click here to buy plan
        </Link>
      </div>
    );

  const daysLeft = differenceInDays(plans[0].endAt, new Date());
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center bg-blue-50 p-2">
        <Badge variant="secondary" className="bg-blue-500 text-white">
          {plans[0].planName}
        </Badge>
        <span>{daysLeft} Days left</span>
      </div>
      <Button variant="outline" asChild className="bg-secondary font-mono">
        <Link href="/plans/purchased">Purchased plan history</Link>
      </Button>
    </div>
  );
}

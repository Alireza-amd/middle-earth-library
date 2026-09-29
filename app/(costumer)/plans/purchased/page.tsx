import { getCurrentUser } from "@/auth/currentUser";
import { CardSkeleton, SkeletonArray } from "@/components/Skeleton";
import { db } from "@/drizzle/db";
import { planTable, purchaseTable, userPlanTable } from "@/drizzle/schema";
import { getUserTag } from "@/lib/cacheTag";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/cache";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { differenceInDays, format } from "date-fns";
import { formatPrice } from "@/lib/formatters";
import { getPlanGlobalTag } from "@/features/plans/db/cache";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  return (
    <div className="container">
      <Suspense
        fallback={
          <SkeletonArray rows={5}>
            <CardSkeleton />
          </SkeletonArray>
        }
      >
        <ShowSearchParams searchParams={searchParams} />
        <UserPlanList />
      </Suspense>
    </div>
  );
}

async function ShowSearchParams({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    message && (
      <div className="font-pop text-2xl p-2 bg-green-300 text-green-700">
        {decodeURIComponent(message)}
      </div>
    )
  );
}

async function UserPlanList() {
  const user = await getCurrentUser({
    getFullUser: true,
    redirectIfNotFound: true,
  });
  const userPlans = await getUserPlans(user.id);

  return (
    <div className="grid lg:grid-cols-3 grid-cols-1 md:grid-cols-2 gap-4">
      {userPlans.map((userPlan) => (
        <Card
          key={userPlan.id}
          className={cn(
            userPlan.endAt > new Date() ? "bg-amber-200" : "bg-amber-50",
            "hover:bg-accent text-amber-900",
          )}
        >
          <CardHeader>
            <CardTitle className="font-pop">{userPlan.title}</CardTitle>
            <CardDescription>
              {formatPrice(userPlan.priceInRials)}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col font-mono">
            <span>
              Purchased At: {format(userPlan.purchasedAt, "yyyy-MM-dd")}
            </span>
            <span>Ends At: {format(userPlan.endAt, "yyyy-MM-dd")}</span>
          </CardContent>
          <CardFooter className="font-sans flex flex-col items-start">
            <div>
              {userPlan.endAt > new Date()
                ? `${differenceInDays(userPlan.endAt, userPlan.purchasedAt)} days left.`
                : "Finished"}
            </div>
            <span>Transcript ID: {userPlan.transcriptId}</span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
async function getUserPlans(userId: string) {
  "use cache";

  cacheTag(
    getUserTag("plan", userId),
    getPlanGlobalTag(),
    getUserTag("purchase", userId),
  );

  return db
    .select({
      id: userPlanTable.id,
      title: planTable.title,
      endAt: userPlanTable.endAt,
      purchasedAt: purchaseTable.createdAt,
      priceInRials: purchaseTable.pricePaidInRials,
      transcriptId: purchaseTable.zarinPalPurchaseId,
    })
    .from(userPlanTable)
    .innerJoin(planTable, eq(userPlanTable.planId, planTable.id))
    .innerJoin(purchaseTable, eq(userPlanTable.id, purchaseTable.userPlanId))
    .where(eq(userPlanTable.userId, userId));
}

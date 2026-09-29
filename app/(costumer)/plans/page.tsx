import { PageHeader } from "@/components/PageHeader";
import {
  PlansList,
  PlansListSkeleton,
} from "@/features/plans/components/PlansList";
import { Suspense } from "react";

export default async function PlansPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  return (
    <div className="container">
      <PageHeader title="Plans" />
      <Suspense fallback={<PlansListSkeleton />}>
        <PlansList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

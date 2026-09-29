import { PageHeader } from "@/components/PageHeader";
import { TableSkeleton } from "@/components/Skeleton";
import { Button } from "@/components/ui/button";
import { PlansTable } from "@/features/plans/components/PlansTable";
import Link from "next/link";
import { Suspense } from "react";

export default async function PlansPage() {
  return (
    <div className="container">
      <PageHeader title="Plans">
        <Button variant="outline" asChild>
          <Link href="/admin/plans/new">NewPlan</Link>
        </Button>
      </PageHeader>
      <Suspense fallback={<TableSkeleton />}>
        <PlansTable />
      </Suspense>
    </div>
  );
}

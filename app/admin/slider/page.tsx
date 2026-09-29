import { SliderTable } from "@/features/slider/components/SliderTable";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/Skeleton";

export default async function SliderAdminPage() {
  return (
    <div className="container">
      <Suspense fallback={<TableSkeleton />}>
        <SliderTable />
      </Suspense>
    </div>
  );
}

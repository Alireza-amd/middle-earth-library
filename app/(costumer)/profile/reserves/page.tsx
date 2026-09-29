import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { TableSkeleton } from "@/components/Skeleton";
import { UserReserveTable } from "@/features/reserve/components/UserReserveTable";

export default function UserReservePage() {
  return (
    <div className="container">
      <Suspense
        fallback={
          <>
            <PageHeader title="My Reserves" />
            <TableSkeleton />
          </>
        }
      >
        <PageHeader title="My Reserves" />
        <UserReserveTable />
      </Suspense>
    </div>
  );
}

import { PageHeader } from "@/components/PageHeader";
import { TableSkeleton } from "@/components/Skeleton";
import { ReserveTable } from "@/features/reserve/components/ReserveTable";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{
    userId?: string;
    status?: string;
    page?: string;
  }>;
};
export default async function AdminReservePage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <div className="container">
      <Suspense
        fallback={
          <>
            <PageHeader title="Reserves" />
            <TableSkeleton />
          </>
        }
      >
        <ReserveTable
          userId={params.userId}
          status={params.status}
          page={Number(params.page ?? 1)}
        />
      </Suspense>
    </div>
  );
}

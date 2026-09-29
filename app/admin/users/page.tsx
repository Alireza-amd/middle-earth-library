import { PageHeader } from "@/components/PageHeader";
import { TableSkeleton } from "@/components/Skeleton";
import { UserTable } from "@/features/user/components/UserTable";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{
    email?: string;
    page?: string;
  }>;
};

export default async function AdminUsersPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <div className="container">
      <Suspense
        fallback={
          <>
            <PageHeader title="Users" />
            <TableSkeleton />
          </>
        }
      >
        <UserTable email={params.email} page={Number(params.page ?? 1)} />
      </Suspense>
    </div>
  );
}

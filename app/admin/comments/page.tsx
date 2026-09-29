import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { TableSkeleton } from "@/components/Skeleton";
import { CommentTable } from "@/features/comments/components/CommentTable";

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function AdminCommentPage({ searchParams }: Props) {
  const params = await searchParams;

  const page = Number(params.page ?? "1");

  return (
    <div className="container">
      <Suspense
        fallback={
          <>
            <PageHeader title="Comments" />
            <TableSkeleton />
          </>
        }
      >
        <CommentTable page={page} />
      </Suspense>
    </div>
  );
}

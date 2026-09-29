"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CommentPagination({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function go(page: number) {
    const params = new URLSearchParams(searchParams);

    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    router.push(`/admin/comments?${params.toString()}`);
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mt-5">
      <Button
        variant="outline"
        className="cursor-pointer"
        disabled={currentPage === 1}
        onClick={() => go(currentPage - 1)}
      >
        Previous
      </Button>

      {Array.from({
        length: totalPages,
      }).map((_, index) => {
        const page = index + 1;

        return (
          <Button
            key={page}
            className="cursor-pointer"
            variant={page === currentPage ? "default" : "outline"}
            onClick={() => go(page)}
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="outline"
        className="cursor-pointer"
        disabled={currentPage === totalPages}
        onClick={() => go(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
}

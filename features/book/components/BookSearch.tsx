"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

export function BookSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams);

    if (value.trim() === "") {
      params.delete("search");
    } else {
      params.set("search", value);
    }

    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="relative mb-8">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />

      <Input
        className="pl-10"
        placeholder="Search books, authors or categories..."
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

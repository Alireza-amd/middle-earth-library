"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { reserveStatus } from "@/drizzle/schema";

export function ReserveStatusFilter() {
  const router = useRouter();

  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams);

    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }

    router.push(`/admin/reserves?${params.toString()}`);
  }

  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Filter status" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">All Status</SelectItem>

        {reserveStatus.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

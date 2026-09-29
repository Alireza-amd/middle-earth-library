"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function UserFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState(searchParams.get("email") ?? "");

  function applyFilters() {
    const params = new URLSearchParams(searchParams);

    if (email.trim()) {
      params.set("email", email);
    } else {
      params.delete("email");
    }

    params.delete("page");

    router.push(`/admin/users?${params.toString()}`);
  }

  function clearFilters() {
    setEmail("");

    router.push("/admin/users");
  }

  return (
    <div className="mb-6 flex gap-4 items-end">
      <div>
        <p className="mb-2 text-sm font-medium">Email</p>

        <Input
          placeholder="Search by email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <Button onClick={applyFilters}>Apply Filters</Button>

      <Button variant="outline" onClick={clearFilters}>
        Clear
      </Button>
    </div>
  );
}

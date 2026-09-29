"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  users: {
    id: string;
    name: string;
    email: string;
  }[];
};

export function ReserveFilter({ users }: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams);

    if (value === "all") {
      params.delete("userId");
    } else {
      params.set("userId", value);
    }

    router.push(`/admin/reserves?${params.toString()}`);
  }

  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className="w-60">
        <SelectValue placeholder="Filter by user" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">All Users</SelectItem>

        {users.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            <div className="flex flex-col">
              <span>{user.name}</span>

              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

import { TUserRoles } from "@/drizzle/schema";

export function canInsertReserve({ banned }: { banned: boolean }) {
  return banned == false;
}
export function canUpdateReserve({ role }: { role: TUserRoles }) {
  return role == "admin";
}

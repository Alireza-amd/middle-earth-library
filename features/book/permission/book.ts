import { TUserRoles } from "@/drizzle/schema";

export function canInsertBook({ role }: { role: TUserRoles }) {
  return role == "admin";
}
export function canUpdateBook({ role }: { role: TUserRoles }) {
  return role == "admin";
}
export function canDeleteBook({ role }: { role: TUserRoles }) {
  return role == "admin";
}

import { TUserRoles } from "@/drizzle/schema";

export function canInsertCategory({ role }: { role: TUserRoles }) {
  return role == "admin";
}
export function canUpdateCategory({ role }: { role: TUserRoles }) {
  return role == "admin";
}
export function canDeleteCategory({ role }: { role: TUserRoles }) {
  return role == "admin";
}

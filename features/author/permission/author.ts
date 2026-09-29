import { TUserRoles } from "@/drizzle/schema";

export function canInsertAuthor({ role }: { role: TUserRoles }) {
  return role == "admin";
}
export function canUpdateAuthor({ role }: { role: TUserRoles }) {
  return role == "admin";
}
export function canDeleteAuthor({ role }: { role: TUserRoles }) {
  return role == "admin";
}

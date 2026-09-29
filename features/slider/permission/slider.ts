import { TUserRoles } from "@/drizzle/schema";

export function canInsertSlider({ role }: { role: TUserRoles }) {
  return role === "admin";
}

export function canUpdateSlider({ role }: { role: TUserRoles }) {
  return role === "admin";
}

export function canDeleteSlider({ role }: { role: TUserRoles }) {
  return role === "admin";
}

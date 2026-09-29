import { TUserRoles } from "@/drizzle/schema";

export function canInsertPlan({ role }: { role: TUserRoles }) {
  return role == "admin";
}

export function canUpdatePlan({role}:{role:TUserRoles}){
  return role=="admin"
}
export function canDeletePlan({role}:{role:TUserRoles}){
  return role=="admin"
}
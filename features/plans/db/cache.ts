import { getGlobalTag, getIdTag } from "@/lib/cacheTag";
import { revalidateTag } from "next/cache";

export function getPlanGlobalTag() {
  return getGlobalTag("plan");
}

export function getPlanIdTag(id: string) {
  return getIdTag("plan", id);
}

export function revalidatePlanTag(id: string) {
  revalidateTag(getPlanIdTag(id), { expire: 0 });
  revalidateTag(getPlanGlobalTag(), { expire: 0 });
}

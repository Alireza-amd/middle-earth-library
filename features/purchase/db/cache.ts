import { getGlobalTag, getIdTag } from "@/lib/cacheTag";
import { revalidateTag } from "next/cache";

export function getPurchaseGlobalTag() {
  return getGlobalTag("purchase");
}
export function getPurchaseIdTag(id: string) {
  return getIdTag("purchase", id);
}
export function revalidatePurchaseTag(id: string) {
  revalidateTag(getPurchaseGlobalTag(), { expire: 0 });
  revalidateTag(getPurchaseIdTag(id), { expire: 0 });
}

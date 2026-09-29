import { getGlobalTag, getIdTag } from "@/lib/cacheTag";
import { revalidateTag } from "next/cache";

export function getCategoryGlobalTag() {
  return getGlobalTag("category");
}
export function getCategoryIdTag(id: string) {
  return getIdTag("author", id);
}
export function revalidateCategoryCache(id: string) {
  revalidateTag(getCategoryGlobalTag(), { expire: 0 });
  revalidateTag(getCategoryIdTag(id), { expire: 0 });
}

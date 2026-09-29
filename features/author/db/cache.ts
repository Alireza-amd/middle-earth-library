import { getGlobalTag, getIdTag } from "@/lib/cacheTag";
import { revalidateTag } from "next/cache";

export function getAuthorGlobalTag() {
  return getGlobalTag("author");
}
export function getAuthorIdTag(id: string) {
  return getIdTag("author", id);
}
export function revalidateAuthorCache(id: string) {
  revalidateTag(getAuthorGlobalTag(), { expire: 0 });
  revalidateTag(getAuthorIdTag(id), { expire: 0 });
}

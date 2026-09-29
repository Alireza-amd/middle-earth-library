import { getGlobalTag, getIdTag } from "@/lib/cacheTag";
import { revalidateTag } from "next/cache";

export function getBookGlobalTag() {
  return getGlobalTag("book");
}
export function getBookIdTag(id: string) {
  return getIdTag("book", id);
}
export function revalidateBookCache(id: string) {
  revalidateTag(getBookGlobalTag(), { expire: 0 });
  revalidateTag(getBookIdTag(id), { expire: 0 });
}

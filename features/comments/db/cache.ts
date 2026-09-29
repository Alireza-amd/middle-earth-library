import { getGlobalTag, getIdTag } from "@/lib/cacheTag";
import { revalidateTag } from "next/cache";

export function getCommentGlobalTag() {
  return getGlobalTag("comment");
}
export function getCommentIdTag(id: string) {
  return getIdTag("comment", id);
}
export function revalidateCommentCache(id: string) {
  revalidateTag(getCommentGlobalTag(), { expire: 0 });
  revalidateTag(getCommentIdTag(id), { expire: 0 });
}

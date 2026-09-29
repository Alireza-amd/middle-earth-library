import { getGlobalTag, getIdTag, getUserTag } from "@/lib/cacheTag";
import { revalidateTag } from "next/cache";

export function getUserGlobalTag() {
  return getGlobalTag("user");
}
export function getUserIdTag(id: string) {
  return getIdTag("user", id);
}

export function revalidateUserCache(id: string) {
  revalidateTag(getUserGlobalTag(), { expire: 0 });
  revalidateTag(getUserIdTag(id), { expire: 0 });
}

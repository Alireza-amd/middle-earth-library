import { getGlobalTag, getIdTag } from "@/lib/cacheTag";
import { revalidateTag } from "next/cache";

export function getReserveGlobalTag() {
  return getGlobalTag("reserve");
}
export function getReserveIdTag(id: string) {
  return getIdTag("reserve", id);
}
export function revalidateReserveCache(id: string) {
  revalidateTag(getReserveGlobalTag(), { expire: 0 });
  revalidateTag(getReserveIdTag(id), { expire: 0 });
}

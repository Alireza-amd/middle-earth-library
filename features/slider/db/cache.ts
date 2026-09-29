import { getGlobalTag, getIdTag } from "@/lib/cacheTag";
import { revalidateTag } from "next/cache";

export function getSliderGlobalTag() {
  return getGlobalTag("slider");
}

export function getSliderIdTag(id: string) {
  return getIdTag("slider", id);
}

export function revalidateSliderCache(id: string) {
  revalidateTag(getSliderGlobalTag(), { expire: 0 });
  revalidateTag(getSliderIdTag(id), { expire: 0 });
}

"use server";

import z from "zod";
import { sliderSchema } from "../schema/slider";
import { insertSlider, updateSlider, deleteSlider } from "../db/slider";
import {
  canInsertSlider,
  canUpdateSlider,
  canDeleteSlider,
} from "../permission/slider";
import { getCurrentUser } from "@/auth/currentUser";

export async function insertSliderItem(
  unsafeData: z.infer<typeof sliderSchema>,
) {
  const { success, data } = sliderSchema.safeParse(unsafeData);

  if (
    !success ||
    !canInsertSlider(await getCurrentUser({ redirectIfNotFound: true }))
  )
    return { error: true, message: "Failed to insert slider item." };

  await insertSlider(data);

  return { error: false, message: "Slider item inserted successfully." };
}

export async function updateSliderItem(
  id: string,
  unsafeData: z.infer<typeof sliderSchema>,
) {
  const { success, data } = sliderSchema.safeParse(unsafeData);

  if (
    !success ||
    !canUpdateSlider(await getCurrentUser({ redirectIfNotFound: true }))
  )
    return { error: true, message: "Failed to update slider item." };

  await updateSlider(id, data);

  return { error: false, message: "Slider item updated successfully." };
}

export async function deleteSliderItem(id: string) {
  if (!canDeleteSlider(await getCurrentUser({ redirectIfNotFound: true })))
    return { error: true, message: "Failed to delete slider item." };

  await deleteSlider(id);

  return { error: false, message: "Slider item deleted successfully." };
}

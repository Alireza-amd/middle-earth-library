"use client"

import { toast } from "sonner";

export function actionToast(actionData: { error: boolean; message: string }) {
  if (actionData.error) return toast.error(actionData.message);
  return toast.success(actionData.message);
}

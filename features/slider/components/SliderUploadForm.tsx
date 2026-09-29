"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { actionToast } from "@/components/actionToast";

export function SliderUploadForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIsLoading(true);

    const response = await fetch("/api/slider/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    actionToast(data);
    setIsLoading(false);

    if (response.ok) {
      onSuccess?.();
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2 text-sm text-gray-700">
        تصویر اسلایدر
        <input
          type="file"
          name="image"
          accept="image/*"
          className="file:border file:px-4 file:py-2 file:rounded-md file:border-neutral-300 file:bg-white"
        />
      </label>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Uploading..." : "Upload slider image"}
      </Button>
    </form>
  );
}

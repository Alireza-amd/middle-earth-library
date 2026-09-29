"use client";

import { ChangeEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { actionToast } from "@/components/actionToast";
import { insertSliderItem, updateSliderItem } from "../action/slider";
import { sliderSchema } from "../schema/slider";

type SliderFormValues = z.infer<typeof sliderSchema>;

export function SliderForm({
  slider,
  onSuccess,
}: {
  slider?: SliderFormValues & { id: string };
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(slider?.imagePath ?? "");

  const form = useForm<SliderFormValues>({
    resolver: zodResolver(sliderSchema),
    defaultValues: {
      imagePath: slider?.imagePath ?? "",
      link: slider?.link ?? "",
    },
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(slider?.imagePath ?? "");
      form.setValue("imagePath", slider?.imagePath ?? "");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFileError("Only image files are allowed.");
      return;
    }

    setFileError(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    form.setValue("imagePath", url);
  };

  const handleSubmit = async (data: SliderFormValues) => {
    startTransition(async () => {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("link", data.link);
        if (slider?.id) {
          formData.append("sliderId", slider.id);
        }

        const response = await fetch("/api/slider/upload", {
          method: "POST",
          body: formData,
        });

        const payload = await response.json();
        actionToast(payload);
        if (response.ok) {
          onSuccess?.();
          router.refresh();
        }

        return;
      }

      if (!slider) {
        setFileError("Image file is required.");
        return;
      }

      const updateData: SliderFormValues = {
        imagePath: slider.imagePath,
        link: data.link,
      };

      const result = await updateSliderItem(slider.id, updateData);
      actionToast(result);
      if (!result.error) {
        onSuccess?.();
        router.refresh();
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="imagePath"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file:border file:border-slate-300 file:px-4 file:py-2 file:text-sm file:font-medium file:bg-slate-50"
                />
              </FormControl>
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="preview"
                  className="mt-3 h-32 w-full rounded-lg object-cover"
                />
              ) : null}
              {fileError ? (
                <p className="text-sm text-destructive">{fileError}</p>
              ) : null}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : slider ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}

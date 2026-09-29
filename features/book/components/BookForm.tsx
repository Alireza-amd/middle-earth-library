"use client";

import z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Textarea } from "@/components/ui/textarea";

import { actionToast } from "@/components/actionToast";

import { bookSchema } from "../schema/book";

import { MultiSelect } from "@/components/ui/custom/MultiSelect";
import { ComboboxDemo } from "@/components/ui/custom/ComboBox";

import { insertBook, updateBook } from "../action/book";

import Image from "next/image";

export function BookForm({
  book,
  categories,
  authors,
  onSuccess,
}: {
  book?: z.infer<typeof bookSchema> & { id: string };

  categories: {
    id: string;
    title: string;
  }[];

  authors: {
    name: string;
    id: string;
  }[];

  onSuccess?: () => void;
}) {
  const [image, setImage] = useState<File | undefined>();

  const [imagePreview, setImagePreview] = useState<string | null>(
    book?.imagePath ?? null,
  );

  const [isLoading, startTransition] = useTransition();

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),

    defaultValues: {
      title: book?.title ?? "",
      desc: book?.desc ?? "",
      isbn: book?.isbn ?? "",
      entity: book?.entity ?? 1,
      authorId: book?.authorId ?? "",
      categoryIds: book?.categoryIds ?? [],
      imagePath: book?.imagePath ?? undefined,
    },
  });

  async function uploadImage() {
    if (!image) {
      return book?.imagePath;
    }

    const formData = new FormData();

    formData.append("image", image);

    const res = await fetch("/api/books/upload", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (result.error) {
      throw new Error(result.message);
    }

    return result.data?.imagePath ?? result.imagePath;
  }

  function onSubmit(data: z.infer<typeof bookSchema>) {
    console.log("FORM SUBMIT", data);

    startTransition(async () => {
      try {
        const imagePath = await uploadImage();
        form.setValue("imagePath", imagePath);
        if (!imagePath) {
          actionToast({
            error: true,
            message: "Image is required.",
          });

          return;
        }

        const finalData = {
          ...data,

          imagePath,
        };

        const action = book ? updateBook.bind(null, book.id) : insertBook;

        const result = await action(finalData);

        actionToast(result);

        onSuccess?.();
      } catch (error) {
        console.error(error);

        actionToast({
          error: true,
          message: "Something went wrong.",
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-[800px] flex flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>

              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>

              <FormControl>
                <Textarea {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>

              <FormControl>
                <MultiSelect
                  options={categories}
                  selectedValues={field.value}
                  onSelectedValuesChange={field.onChange}
                  getLable={(x) => x.title}
                  getValue={(x) => x.id}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="entity"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Entity</FormLabel>

                <FormControl>
                  <Input
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="authorId"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Author</FormLabel>

                <FormControl>
                  <ComboboxDemo
                    options={authors}
                    selectedValue={field.value}
                    onSelectedValueChange={field.onChange}
                    getLabel={(x) => x.name}
                    getValue={(x) => x.id}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormItem>
          <FormLabel>Image</FormLabel>

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                setImage(file);

                const previewUrl = URL.createObjectURL(file);

                setImagePreview(previewUrl);
              }
            }}
          />

          {imagePreview && (
            <div className="relative w-full h-64 mt-2 overflow-hidden rounded-md">
              <Image
                src={imagePreview}
                alt="book preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </FormItem>

        <FormField
          control={form.control}
          name="isbn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ISBN</FormLabel>

              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading}>
          {isLoading ? "Loading..." : book ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}

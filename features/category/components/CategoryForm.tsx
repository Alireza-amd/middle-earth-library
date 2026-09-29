"use client";

import z from "zod";
import { categorySchema } from "../schema/category";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
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
import { insertCategory, updateCategory } from "../action/category";
import { actionToast } from "@/components/actionToast";

export function CategoryForm({
  category,
  onSuccess,
}: {
  category?: z.infer<typeof categorySchema> & { id: string };
  onSuccess: () => void;
}) {
  const [isLoading, startTransition] = useTransition();

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: category?.title ?? "",
    },
  });

  function onSubmit(data: z.infer<typeof categorySchema>) {
    startTransition(async () => {
      const action = category
        ? updateCategory.bind(null, category.id)
        : insertCategory.bind(null);
      actionToast(await action(data));
      onSuccess();
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
                <Input {...field} placeholder="name..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">
          {isLoading ? "Loading..." : category ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}

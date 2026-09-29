"use client";

import z from "zod";
import { authorSchema } from "../schema/author";
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
import { insertAuthor, updateAuthor } from "../action/author";
import { actionToast } from "@/components/actionToast";

export function AuthorForm({
  author,
  onSuccess,
}: {
  author?: z.infer<typeof authorSchema> & { id: string };
  onSuccess: () => void;
}) {
  const [isLoading, startTransition] = useTransition();

  const form = useForm<z.infer<typeof authorSchema>>({
    resolver: zodResolver(authorSchema),
    defaultValues: {
      name: author?.name ?? "",
      description: author?.description ?? "",
    },
  });

  function onSubmit(data: z.infer<typeof authorSchema>) {
    startTransition(async () => {
      const action = author
        ? updateAuthor.bind(null, author.id)
        : insertAuthor.bind(null);
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
          name="name"
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
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="description..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          {isLoading ? "Loading..." : author ? "Update" : "Create"}
        </Button>
      </form>
    </Form>
  );
}

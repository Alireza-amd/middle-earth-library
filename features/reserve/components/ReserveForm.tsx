"use client";

import z from "zod";
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
import { Button } from "@/components/ui/button";
import { actionToast } from "@/components/actionToast";
import { ComboboxDemo } from "@/components/ui/custom/ComboBox";
import { reserveSchema } from "../schema/reserve";
import { insertReserve } from "../action/reserve";

export function ReserveForm({
  users,
  books,
  onSuccess
}: {
  users: {
    name: string;
    id: string;
  }[];
  books: {
    title: string;
    id: string;
}[]
  onSuccess?: () => void;
}) {
  const [isLoading, startTransition] = useTransition();

  const form = useForm<z.infer<typeof reserveSchema>>({
    resolver: zodResolver(reserveSchema),
    defaultValues: {
        bookId:"",userId:""
    },
  });

  function onSubmit(data: z.infer<typeof reserveSchema>) {
    startTransition(async () => {
      actionToast(await insertReserve(data));
      onSuccess && onSuccess();
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
            name="bookId"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Book</FormLabel>
                <FormControl>
                  <ComboboxDemo
                    options={books}
                    selectedValue={field.value}
                    onSelectedValueChange={field.onChange}
                    getLabel={(book) => book.title}
                    getValue={(book) => book.id}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>User</FormLabel>
                <FormControl>
                  <ComboboxDemo
                    options={users}
                    selectedValue={field.value}
                    onSelectedValueChange={field.onChange}
                    getLabel={(user) => user.name}
                    getValue={(user) => user.id}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." :  "Create"}
        </Button>
      </form>
    </Form>
  );
}

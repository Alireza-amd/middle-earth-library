"use client";

import { useForm } from "react-hook-form";
import { commentSchema } from "../schema/comment";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { insertComment, updateComment } from "../action/comment";
import { actionToast } from "@/components/actionToast";
import { useUserStore } from "@/store/user";
import { useQueryClient } from "@tanstack/react-query";
import { getBookTag } from "@/lib/cacheTag";
import Link from "next/link";

export function CommentForm({
  bookId,
  parentId,
  handleState,
  comment,
  adminUser,
}: {
  bookId: string;
  parentId?: string;
  handleState?: () => void;
  comment?: {
    id: string;
    spoiler: boolean;
    content: string;
    parentId: string | null;
  };
  adminUser?: {
    id: string;
    name: string;
  };
}) {
  const storeUser = useUserStore((state) => state.user);

  const user = adminUser ?? storeUser;

  const [isLoading, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: comment?.content ?? "",
      parentId: parentId ?? comment?.parentId ?? "",
      spoiler: comment?.spoiler ?? false,
    },
  });

  if (user == null)
    return (
      <div className="font-sans text-[15px] self-center ">
        <Link
          href="/sign-in"
          className="text-amber-500 hover:underline underline-offset-4"
        >
          SignIn
        </Link>{" "}
        or{" "}
        <Link
          href="sign-up"
          className="text-amber-500 hover:underline underline-offset-4"
        >
          SignUp
        </Link>
      </div>
    );

  const handleSubmit = (data: z.infer<typeof commentSchema>) => {
    startTransition(async () => {
      const action = comment
        ? updateComment.bind(null, comment.id, {
            bookId,
            id: comment.id,
            content: data.content,
            parentId: data.parentId,
            spoiler: data.spoiler,
            userId: user.id,
          })
        : insertComment.bind(null, {
            bookId,
            content: data.content,
            parentId: data.parentId,
            spoiler: data.spoiler,
            userId: user.id,
          });
      actionToast(await action());
      queryClient.invalidateQueries({
        queryKey: [getBookTag("comment", bookId), user?.id ?? null],
      });
      handleState && handleState();
      form.reset();
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex my-6 flex-col space-y-6"
      >
        <h1 className="font-mono text-[15px] text-amber-500">
          Leave a comment: {user.name}
        </h1>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-30" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="spoiler"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center gap-2">
                  <span>This comment contain spoil.</span>
                  <Input
                    className="size-5 cursor-pointer"
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="secondary"
          className="cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "Loading" : comment ? "Edit" : "submit"}
        </Button>
      </form>
    </Form>
  );
}

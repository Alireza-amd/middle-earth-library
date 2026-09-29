"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useUserStore } from "@/store/user";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getBookComments } from "../db/comment";
import { getBookTag } from "@/lib/cacheTag";
import { formatPlurals } from "@/lib/formatters";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";
import { formatComments } from "@/lib/formatComments";

export function Comments({ bookId }: { bookId: string }) {
  const user = useUserStore((state) => state.user);
  const {
    data: comments,
    error,
    isLoading,
  } = useQuery({
    queryKey: [getBookTag("comment", bookId), user?.id ?? null],
    queryFn: async () => await getBookComments(bookId, user?.id),
  });

  if (error) return <h1>Failed to load comments</h1>;
  if (isLoading) return <h1>Loading...</h1>;
  if (comments == null) return;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="hover:cursor-pointer text-lg">
          Comments
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-2 py-4 px-3">
            <div className="flex items-center justify-between">
              <div className="flex font-pop text-xl items-center justify-center flex-col ">
                <span className="font-semibold text-amber-500">
                  {comments.length}
                </span>
                {formatPlurals(comments.length, {
                  plural: "comments",
                  singular: "comment",
                })}
              </div>
              <div className="flex items-center gap-2">
                <ChatBubbleIcon className="size-5 text-amber-500" />
                <span className="font-pop text-lg">Users comments</span>
              </div>
            </div>
            <hr />
            {user ? (
              <CommentForm bookId={bookId} />
            ) : (
              <div className="font-sans text-[15px] self-center ">
                For commenting you should{" "}
                <Link
                  href="/sign-in"
                  className="text-amber-500 hover:underline underline-offset-4"
                >
                  Sign in
                </Link>{" "}
                or{" "}
                <Link
                  href="sign-up"
                  className="text-amber-500 hover:underline underline-offset-4"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {comments.length > 0 ? (
              formatComments(comments).map((comment) => (
                <CommentItem
                  key={comment.id}
                  bookId={bookId}
                  comment={comment}
                />
              ))
            ) : (
              <h1>No comment yet..</h1>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

"use client";

import { ResetIcon } from "@radix-ui/react-icons";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { CommentForm } from "./CommentForm";
import { TComment } from "@/lib/formatComments";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/user";
import { EditIcon, TrashIcon } from "lucide-react";
import { ActionButton } from "@/components/ActionButton";
import { deleteComment, likeComment } from "../action/comment";
import { useQueryClient } from "@tanstack/react-query";
import { getBookTag, getUserTag } from "@/lib/cacheTag";
import Link from "next/link";

export function CommentItem({
  comment,
  bookId,
}: {
  bookId: string;
  comment: TComment;
}) {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const [reply, setReply] = useState(false);
  const [spoiler, setSpoiler] = useState(comment.spoiler);
  const [edit, setEdit] = useState(false);
  const likeActive = comment.userLike === true;
  const dislikeActive = comment.userLike === false;

  function handleReplyClick() {
    setReply((prev) => !prev);
  }

  return (
    <>
      <div
        style={{
          width: comment.depth
            ? `calc(100% - ${comment.depth * 30}px)`
            : "100%",
        }}
        className={cn("p-5 relative bg-neutral-900 text-white  rounded-2xl")}
      >
        {spoiler && (
          <div
            className={
              "absolute shadow-none inset-0 rounded-2xl flex items-center justify-center z-10 backdrop-blur-sm"
            }
          >
            <Button
              variant="secondary"
              onClick={() => setSpoiler(false)}
              className="bg-neutral-700 hover:bg-neutral-800 text-white cursor-pointer"
            >
              Show Comment
            </Button>
          </div>
        )}
        <div className="flex">
          <div className="flex items-strtch h-16 gap-1 self-center-safe">
            {user && user.id == comment.user.id && (
              <>
                <ActionButton
                  action={async () => {
                    const response = await deleteComment(comment.id);
                    if (!response.error)
                      queryClient.invalidateQueries({
                        queryKey: [
                          getBookTag("comment", bookId),
                          user?.id ?? null,
                        ],
                      });
                    return response;
                  }}
                  variant="destructive"
                  className="h-full"
                >
                  <TrashIcon />
                </ActionButton>
                <Button
                  variant="secondary"
                  onClick={() => setEdit((prev) => !prev)}
                  className="bg-neutral-700 h-full cursor-pointer text-white hover:text-neutral-700"
                >
                  <EditIcon />
                </Button>
              </>
            )}
            {user ? (
              <>
                <ActionButton
                  className={cn(
                    "bg-neutral-700 h-full cursor-pointer text-white hover:text-neutral-700 flex flex-col",
                    likeActive && "bg-rose-600 text-black",
                  )}
                  action={async () => {
                    const response = await likeComment({
                      commentId: comment.id,
                      bookId,
                      isLike: true,
                    });

                    if (!response.error) {
                      queryClient.invalidateQueries({
                        queryKey: [
                          getBookTag("comment", bookId),
                          user?.id ?? null,
                        ],
                      });
                    }

                    return response;
                  }}
                >
                  <span>👍</span>
                  <span>{comment.likes}</span>
                </ActionButton>
                <ActionButton
                  className={cn(
                    "bg-neutral-700 h-full cursor-pointer text-white hover:text-neutral-700 flex flex-col",
                    dislikeActive && "bg-rose-600 text-white",
                  )}
                  action={async () => {
                    const response = await likeComment({
                      commentId: comment.id,
                      bookId,
                      isLike: false,
                    });

                    if (!response.error) {
                      queryClient.invalidateQueries({
                        queryKey: [
                          getBookTag("comment", bookId),
                          user?.id ?? null,
                        ],
                      });
                    }

                    return response;
                  }}
                >
                  <span>👎</span>
                  <span>{comment.dislikes}</span>
                </ActionButton>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="flex items-center cursor-pointer hover:bg-neutral-200 p-2 bg-neutral-700 flex-col gap-2 rounded-lg"
                >
                  <span>👍</span>
                  <span>{comment.likes}</span>
                </Link>
                <Link
                  href="/sign-in"
                  className="flex items-center cursor-pointer hover:bg-neutral-200 p-2 bg-neutral-700 flex-col gap-2 rounded-lg"
                >
                  <span>👎</span>
                  <span>{comment.dislikes}</span>
                </Link>
              </>
            )}
          </div>
          <div className="flex flex-col w-full justify-between gap-5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-amber-500 font-semibold">
                  {comment.user.name}
                </span>
                {comment.repliedTo && (
                  <span className="font-mono text-amber-500 font-semibold">
                    RepliedTo :{" "}
                    <span className="text-white">{comment.repliedTo}</span>
                  </span>
                )}
              </div>
              <span className="capitalize font-mono">
                {formatDistanceToNow(comment.createdAt, {
                  addSuffix: true,
                })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="flex-1 font-sans">{comment.content}</p>
              <button
                onClick={handleReplyClick}
                className="size-8 cursor-pointer rounded-md border-2 border-white rotate-45 flex items-center justify-center"
              >
                <ResetIcon className="-rotate-45 text-amber-500 size-4" />
              </button>
            </div>
          </div>
        </div>
        {edit && (
          <CommentForm
            comment={comment}
            handleState={setEdit.bind(null, false)}
            bookId={bookId}
          />
        )}
        {reply && (
          <CommentForm
            handleState={setReply.bind(null, false)}
            bookId={bookId}
            parentId={comment.id}
          />
        )}
      </div>
      {comment.replies &&
        comment.replies.map((reply) => (
          <CommentItem bookId={bookId} comment={reply} key={reply.id} />
        ))}
    </>
  );
}

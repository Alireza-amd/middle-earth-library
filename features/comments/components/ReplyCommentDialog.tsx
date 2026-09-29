"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getCurrentUser } from "@/auth/currentUser";
import { Button } from "@/components/ui/button";
import { CommentForm } from "./CommentForm";
import { useState } from "react";

export function ReplyCommentDialog({
  bookId,

  commentId,

  user,
}: {
  bookId: string;

  commentId: string;

  user: {
    id: string;
    name: string;
  };
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Reply</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reply to comment</DialogTitle>
        </DialogHeader>

        <CommentForm
          bookId={bookId}
          parentId={commentId}
          adminUser={user}
          handleState={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

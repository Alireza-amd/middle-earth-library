"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AuthorForm } from "./AuthorForm";
import { authorSchema } from "../schema/author";
import z from "zod";

export function AuthorDialogForm({
  author,
}: {
  author?: z.infer<typeof authorSchema> & { id: string };
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "cursor-pointer"
        )}
        onClick={() => setIsOpen(true)}
      >
        {author ? "Update Author" : "Create Author"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {author ? "Update Author" : "Create Author"}
          </DialogTitle>
        </DialogHeader>
        <AuthorForm author={author} onSuccess={() => setIsOpen(false)} />
        <DialogFooter>
          <DialogClose
            onClick={() => setIsOpen(false)}
            className={buttonVariants({ variant: "secondary" })}
          >
            Cancel
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

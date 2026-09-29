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
import { ReserveForm } from "./ReserveForm";

export function ReserveFormDialog({
  users,
  books,
}: {
  users: {
    name: string;
    id: string;
  }[];
  books: {
    title: string;
    id: string;
  }[];
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
        Create Reserve
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-100px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Reserve</DialogTitle>
        </DialogHeader>
        <ReserveForm
          users={users}
          books={books}
          onSuccess={() => setIsOpen(false)}
        />
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

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
import z from "zod";
import { bookSchema } from "../schema/book";
import { BookForm } from "./BookForm";

export function BookFormDialog({
  book,
  categories,
  authors,
}: {
  book?: z.infer<typeof bookSchema> & { id: string };
  categories: { id: string; title: string }[];
  authors: {
    name: string;
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
        {book ? "Update Book" : "Create Book"}
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-100px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{book ? "Update Book" : "Create Book"}</DialogTitle>
        </DialogHeader>
        <BookForm
          book={book}
          authors={authors}
          categories={categories}
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

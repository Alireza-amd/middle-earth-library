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
import { CategoryForm } from "./CategoryForm";
import { categorySchema } from "../schema/category";
import z from "zod";

export function CategoryDialogForm({
  category,
}: {
  category?: z.infer<typeof categorySchema> & { id: string };
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
        {category ? "Update Category" : "Create Category"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Update Category" : "Create Category"}
          </DialogTitle>
        </DialogHeader>
        <CategoryForm category={category} onSuccess={() => setIsOpen(false)} />
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

"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlanForm } from "./PlanForm";
import { buttonVariants } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function PlanFormDialog({
  plan,
}: {
  plan: {
    id: string;
    title: string;
    durationMonth: number;
    priceInRials: number;
    active: boolean;
  };
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
        Update Plan
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Plan</DialogTitle>
        </DialogHeader>
        <PlanForm plan={plan} onSuccess={() => setIsOpen(false)} />
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

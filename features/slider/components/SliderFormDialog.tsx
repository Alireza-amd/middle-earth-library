"use client";

import { useState } from "react";
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
import { cn } from "@/lib/utils";
import z from "zod";
import { sliderSchema } from "../schema/slider";
import { SliderForm } from "./SliderForm";

export function SliderFormDialog({
  slider,
}: {
  slider?: z.infer<typeof sliderSchema> & { id: string };
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "cursor-pointer",
        )}
        onClick={() => setIsOpen(true)}
      >
        {slider ? "Update Slider" : "Create Slider"}
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-100px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {slider ? "Update Slider" : "Create Slider"}
          </DialogTitle>
        </DialogHeader>
        <SliderForm slider={slider} onSuccess={() => setIsOpen(false)} />
        <DialogFooter>
          <DialogClose className={buttonVariants({ variant: "secondary" })}>
            Cancel
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

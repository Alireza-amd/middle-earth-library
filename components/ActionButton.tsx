"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { actionToast } from "@/components/actionToast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ActionButton({
  action,
  requiredAreYouSure = false,
  refreshOnSuccess = false,
  children,
  ...params
}: Omit<React.ComponentPropsWithoutRef<typeof Button>, "onClick"> & {
  action: () => Promise<{ error: boolean; message: string }>;
  requiredAreYouSure?: boolean;
  refreshOnSuccess?: boolean;
}) {
  const [isLoading, startTransition] = useTransition();
  async function handleClick() {
    startTransition(async () => {
      const response = await action();
      actionToast(response);
      if (!response.error && refreshOnSuccess) {
      }
    });
  }

  if (requiredAreYouSure)
    return (
      <AlertDialog>
        <AlertDialogTrigger
          className={cn(
            "cursor-pointer",
            isLoading ? "opacity-70" : "opacity-100",
            buttonVariants({ variant: "destructive" }),
          )}
          disabled={isLoading}
        >
          {isLoading ? "Loading ..." : children}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClick}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      {...params}
      className={cn(
        "cursor-pointer",
        isLoading ? "opacity-70" : "opacity-100",
        params.className,
      )}
    >
      {isLoading ? "Loading ..." : children}
    </Button>
  );
}

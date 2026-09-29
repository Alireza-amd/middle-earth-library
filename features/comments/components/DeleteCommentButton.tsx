"use client";

import { ActionButton } from "@/components/ActionButton";
import { deleteAdminComment } from "../action/adminComment";

export function DeleteCommentButton({ commentId }: { commentId: string }) {
  return (
    <ActionButton
      variant="destructive"
      requiredAreYouSure
      action={deleteAdminComment.bind(null, commentId)}
    >
      Delete
    </ActionButton>
  );
}

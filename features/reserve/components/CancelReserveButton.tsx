"use client";

import { ActionButton } from "@/components/ActionButton";
import { cancelReserve } from "../action/userReserve";

type Props = {
  reserveId: string;
};

export function CancelReserveButton({ reserveId }: Props) {
  return (
    <ActionButton
      requiredAreYouSure
      action={cancelReserve.bind(null, {
        reserveId,
      })}
    >
      Cancel
    </ActionButton>
  );
}

"use server";

import { db } from "@/drizzle/db";
import { reserveTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

import { getCurrentUser } from "@/auth/currentUser";
import { revalidateTag } from "next/cache";
import { getReserveGlobalTag } from "../db/cache";

export async function cancelReserve({ reserveId }: { reserveId: string }) {
  const user = await getCurrentUser({
    redirectIfNotFound: true,
  });

  const reserve = await db.query.reserveTable.findFirst({
    where: eq(reserveTable.id, reserveId),
  });

  if (!reserve) {
    return {
      error: true,
      message: "Reserve not found.",
    };
  }

  if (reserve.userId !== user.id) {
    return {
      error: true,
      message: "You cannot cancel this reserve.",
    };
  }

  if (reserve.status !== "pending") {
    return {
      error: true,
      message: "Only pending reserves can be cancelled.",
    };
  }

  await db
    .update(reserveTable)
    .set({
      status: "cancelled",
    })
    .where(eq(reserveTable.id, reserveId));

  revalidateTag(getReserveGlobalTag(), { expire: 0 });

  return {
    error: false,
    message: "Reserve cancelled successfully.",
  };
}

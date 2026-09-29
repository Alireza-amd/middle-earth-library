import { cacheTag } from "next/cache";
import { desc, eq } from "drizzle-orm";

import { db } from "@/drizzle/db";
import { reserveTable } from "@/drizzle/schema";
import { getCurrentUser } from "@/auth/currentUser";
import { getReserveGlobalTag } from "./cache";

export async function getUserReserves() {
  const user = await getCurrentUser({
    redirectIfNotFound: true,
  });

  return getUserReservesByUserId(user.id);
}

async function getUserReservesByUserId(userId: string) {
  "use cache";

  cacheTag(getReserveGlobalTag());

  return db.query.reserveTable.findMany({
    where: eq(reserveTable.userId, userId),

    columns: {
      id: true,
      status: true,
      createdAt: true,
      dueDate: true,
      returnedAt: true,
    },

    with: {
      book: {
        columns: {
          id: true,
          title: true,
          imagePath: true,
        },
      },
    },

    orderBy: [desc(reserveTable.createdAt)],
  });
}

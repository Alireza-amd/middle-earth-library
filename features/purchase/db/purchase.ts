import { db } from "@/drizzle/db";
import { purchaseTable } from "@/drizzle/schema";
import { getUserTag } from "@/lib/cacheTag";
import { revalidateTag } from "next/cache";
import { revalidatePurchaseTag } from "./cache";

export async function insertPurchase(
  trx: Omit<typeof db, "$client"> = db,
  {
    userId,
    pricePaidInRials,
    userPlanId,
    zarinPalPurchaseId,
  }: {
    pricePaidInRials: number;
    userId: string;
    userPlanId: string;
    zarinPalPurchaseId: string;
  }
) {
  const [insertedPurchase] = await trx
    .insert(purchaseTable)
    .values({
      pricePaidInRials,
      userPlanId,
      zarinPalPurchaseId,
    })
    .returning();

  if (insertedPurchase == null) throw new Error("Failed to insert Purchase");

  revalidateTag(getUserTag("purchase", userId), { expire: 0 });
  revalidatePurchaseTag(insertedPurchase.id);
}

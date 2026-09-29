import { serverEnv } from "@/data/env/server";
import { redirect } from "next/navigation";
import z from "zod";

export class ZarinPaal {
  private sendDataEndpoint =
    "https://sandbox.zarinpal.com/pg/v4/payment/request.json";
  private paymentEndpoint = "https://sandbox.zarinpal.com/pg/StartPay";
  private paymentAuthorizationEndpoint =
    "https://sandbox.zarinpal.com/pg/v4/payment/verify.json";
  private merchantId = serverEnv.ZARINPAAL_MARCHENT_ID;

  private amount: number;
  private infoSchema = z.object({
    data: z.object({ code: z.number(), authority: z.string() }),
  });
  private authorizeSchema = z.object({
    data: z.object({ code: z.number(), ref_id: z.number() }),
  });

  constructor({ price }: { price: number }) {
    this.amount = price;
  }

  async register(callbackURL: string) {
    try {
      return await fetch(this.sendDataEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          merchant_id: this.merchantId,
          amount: this.amount,
          description: "test",
          callback_url: callbackURL,
        }),
      })
        .then((res) => res.json())
        .then((unsafeData) => {
          const { success, data } = this.infoSchema.safeParse(unsafeData);

          if (!success) throw unsafeData;

          return `${this.paymentEndpoint}/${data.data.authority}`;
        });
    } catch (error: any) {
      console.error(error);
      throw new Error(error.errors.message);
    }
  }

  async authorize(authority: string) {
    return await fetch(this.paymentAuthorizationEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        merchant_id: this.merchantId,
        amount: this.amount,
        authority,
      }),
    })
      .then((res) => res.json())
      .then((unsafeData) => {
        const { success, data } = this.authorizeSchema.safeParse(unsafeData);

        if (!success) throw new Error("Payment authorization failed.");

        return {
          code: data.data.code,
          refId: data.data.ref_id,
        };
      });
  }
}

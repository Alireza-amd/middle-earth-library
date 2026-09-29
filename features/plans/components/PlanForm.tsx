"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { planSchema } from "../schema/plan";
import { planTable } from "@/drizzle/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { insertPlan, updatePlan } from "../actions/plan";
import { actionToast } from "@/components/actionToast";
import { Dispatch, SetStateAction } from "react";

export function PlanForm({
  plan,
  onSuccess
}: {
  onSuccess?:()=>void
  plan?: {
    id: string;
    title: string;
    durationMonth: number;
    priceInRials: number;
    active: boolean;
  };
}) {
  const form = useForm<z.infer<typeof planSchema>>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      durationMonth: plan?.durationMonth ?? 0,
      title: plan?.title ?? "",
      priceInRials: plan?.priceInRials ?? 0,
      active: plan?.active ?? true,
    },
  });

  async function handleSubmit(data: z.infer<typeof planSchema>) {
    const action = plan
      ? updatePlan.bind(null, plan.id,data)
      : insertPlan.bind(null, data);
    actionToast(await action());
    form.reset();
    onSuccess && onSuccess()
  }

  return (
    <Form {...form}>
      <form
        className="max-w-[800px] flex flex-col gap-2"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="name..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="durationMonth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input
                  min={0}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                  }}
                  type="number"
                  value={field.value}
                  placeholder="Duration in Months ..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priceInRials"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  min={0}
                  value={field.value}
                  placeholder="price..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Active Plan</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">submit</Button>
      </form>
    </Form>
  );
}

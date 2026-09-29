"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signInSchema } from "../schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  EyeClosedIcon,
  EyeOpenIcon,
  GitHubLogoIcon,
} from "@radix-ui/react-icons";
import { redirectToOAuthProvider, signIn } from "../action";
import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";

export function SignInFrom() {
  const [error, setError] = useState("");
  const [isLoading, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const searchParams=useSearchParams()
  const oAuthError=searchParams.get("oAuthError")

  useEffect(()=>{
    if (oAuthError) {
      setError(decodeURIComponent(oAuthError))
    }
  },[oAuthError])
  
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof signInSchema>) {
    startTransition(async () => {
      const errorMessage = await signIn(data);
      setError(errorMessage);
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-3"
      >
        {error && (
          <div className="font-sans text-2xl my-3 text-destructive">
            {error}
          </div>
        )}
        <div className=" flex items-center gap-2">
          <Button
            type="button"
            onClick={() => redirectToOAuthProvider("github")}
          >
            Github
            <GitHubLogoIcon />
          </Button>
          <Button type="button"
          onClick={() => redirectToOAuthProvider("google")}
          >
            Google
          </Button>
        </div>
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input id="email" placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center flex-row-reverse">
                  <Button
                    type="button"
                    size="lg"
                    className="ml-auto cursor-pointer"
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </Button>
                  <Input
                  id="password"
                    placeholder="Password"
                    {...field}
                    type={showPassword ? "text" : "password"}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 justify-items-start w-fit">
          <Button
            type="submit"
            disabled={isLoading}
            variant={isLoading ? "outline" : "default"}
            className="cursor-pointer col-start-1 col-end-2"
          >
            Sign In
          </Button>
          <Button type="button" asChild className="col-start-2 col-end-3">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}

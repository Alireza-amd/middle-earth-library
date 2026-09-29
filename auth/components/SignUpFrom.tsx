"use client";

import { useForm } from "react-hook-form";
import z, { success } from "zod";
import {
  stepOneSignUpSchema,
  stepTwoSignUpSchema,
  TStepOneSignUp,
} from "../schema";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  redirectToOAuthProvider,
  sendVerficationCode,
  signUpStep_1,
  signUpStep_2,
} from "../action";
import { actionToast } from "@/components/actionToast";

export function SignUpForm() {
  const [step, setStep] = useState(0);
  const [signUpData, setSignUpData] = useState<TStepOneSignUp>({
    password: "",
    confirmPassword: "",
    email: "",
    name: "",
  });
  return (
    <>
      <div className=" flex items-center self-start gap-2 my-3">
        <Button type="button" onClick={() => redirectToOAuthProvider("github")}>
          Github
          <GitHubLogoIcon />
        </Button>
        <Button type="button" onClick={() => redirectToOAuthProvider("google")}>
          Google
        </Button>
      </div>
      <div className="relative overflow-hidden w-full h-screen">
        <StepOneSignUpForm
          signUpData={signUpData}
          setSignUpData={setSignUpData}
          setStep={setStep}
          step={step}
        />
        <StepTwoSignUpForm
          signUpData={signUpData}
          setSignUpData={setSignUpData}
          setStep={setStep}
          step={step}
        />
      </div>
    </>
  );
}

function StepOneSignUpForm({
  setStep,
  step,
  signUpData,
  setSignUpData,
}: {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  signUpData: TStepOneSignUp;
  setSignUpData: Dispatch<
    SetStateAction<{
      email: string;
      password: string;
      confirmPassword: string;
      name: string;
    }>
  >;
}) {
  const [status, setStatus] = useState<{ success: boolean; message: string }>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfrimPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const form = useForm<TStepOneSignUp>({
    resolver: zodResolver(stepOneSignUpSchema),
    defaultValues: {
      email: signUpData.email,
      password: signUpData.password,
      confirmPassword: signUpData.confirmPassword,
      name: signUpData.name,
    },
  });

  async function onSubmit(data: TStepOneSignUp) {
    const response = await signUpStep_1(data);
    if (response.success) {
      setSignUpData(data);
      setStep(1);
    }
    setStatus(response);
  }
  return (
    <div
      className={cn(
        "w-full flex flex-col gap-3 absolute inset-0 transition-all duration-300",
        step == 0 ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-3"
        >
          {status && (
            <div
              className={cn(
                "font-sans text-2xl my-3 ",
                status.success ? "text-green-400" : "text-destructive"
              )}
            >
              {status.message}
            </div>
          )}

          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input id="name" placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center flex-row-reverse">
                    <Button
                      type="button"
                      size="lg"
                      className="ml-auto cursor-pointer"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                    >
                      {showConfrimPassword ? (
                        <EyeOpenIcon />
                      ) : (
                        <EyeClosedIcon />
                      )}
                    </Button>
                    <Input
                      id="confirm_password"
                      placeholder="Confirm Password"
                      {...field}
                      type={showConfrimPassword ? "text" : "password"}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button type="submit">Sign Up</Button>
            <Button type="button" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
function StepTwoSignUpForm({
  setStep,
  step,
  signUpData,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  step: number;
  signUpData: TStepOneSignUp;
  setSignUpData: Dispatch<
    SetStateAction<{
      email: string;
      password: string;
      confirmPassword: string;
      name: string;
    }>
  >;
}) {
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof stepTwoSignUpSchema>>({
    resolver: zodResolver(stepTwoSignUpSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(data: z.infer<typeof stepTwoSignUpSchema>) {
    const errorMessage = await signUpStep_2({ ...signUpData, code: data.code });
    setError(errorMessage);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "w-full flex flex-col gap-3 absolute inset-0 transition-all duration-300",
          step == 1 ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
      >
        {error && (
          <div className={"font-sans text-2xl my-3 text-destructive"}>
            {error}
          </div>
        )}
        <FormField
          name="code"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center">
                  <Input placeholder="Verfication Code" {...field} />
                  <Timer email={signUpData.email} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit">Confirm Code</Button>
          <Button type="button" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button type="button" onClick={() => setStep(0)}>
            Back
          </Button>
        </div>
      </form>
    </Form>
  );
}

function Timer({ email }: { email: string }) {
  const [seconds, setSeconds] = useState(0);
  const remainigMinutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  async function handleClick() {
    await sendVerficationCode(email);
    actionToast({error:false,message:"Verfication code sent successfully."})
    setSeconds(120);
  }

  useEffect(() => {
    const decrementSecondsTimer = setTimeout(() => {
      if (seconds > 0) {
        setSeconds((prev) => prev - 1);
      }
    }, 1000);

    return () => {
      clearTimeout(decrementSecondsTimer);
    };
  }, [seconds]);

  if (seconds == 0) {
    return (
      <Button type="button" onClick={handleClick}>
        Send Verfication Code
      </Button>
    );
  }

  return (
    <Badge className="text-2xl w-[100px]">
      0{remainigMinutes}:
      {remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds}
    </Badge>
  );
}

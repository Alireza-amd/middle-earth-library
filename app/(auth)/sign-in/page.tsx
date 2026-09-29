import { Suspense } from "react";
import { SignInFrom } from "@/auth/components/SignInForm";
import { PageHeader } from "@/components/PageHeader";

export default function SignInPage() {
  return (
    <div className="container flex flex-col items-center">
      <PageHeader title="SignIn" />
      <Suspense fallback={<div className="py-10">Loading...</div>}>
        <SignInFrom />
      </Suspense>
    </div>
  );
}

import { SignUpForm } from "@/auth/components/SignUpFrom";
import { PageHeader } from "@/components/PageHeader";

export default function SignInPage() {
  return (
    <div className="container flex flex-col items-center">
      <PageHeader title="SignUp" />
      <SignUpForm/>
    </div>
  );
}

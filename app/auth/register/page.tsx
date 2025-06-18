import { AuthFooter } from "@/components/auth/auth-footer";
import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";


export default function RegisterPage() {
  return (
      <div className="flex flex-col items-center justify-center w-full h-full">
      <h1 className="pb-8 text-4xl font-semibold md:pb-12 sm:text-6xl md:text-7xl xl:text-8xl 2xl:text-9xl">Create account</h1>
        <RegisterForm />

        <AuthFooter src="/auth/login" text="Already have an account? Login" />
      </div>
  );
}

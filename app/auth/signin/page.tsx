"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthInput } from "@/components/auth/AuthInput";
import { FormError } from "@/components/auth/FormError";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthFooter } from "@/components/auth/AuthFooter";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormValues) => {
    setErrorMessage(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!result) {
        setErrorMessage("Login failed. Please try again.");
        return;
      }

      if (result.ok) {
        router.push("/");
        router.refresh();
      } else {
        setErrorMessage(result.error || "Invalid email or password");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      <AuthHeader
        title="Welcome back"
        subtitle=" Sign in to your account to continue"
      />
      {/* Sign In Form */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Email Field */}
          <AuthInput
            label="Email address"
            icon={Mail}
            type="email"
            {...register("email")}
            error={errors.email?.message}
            placeholder="you@example.com"
          />

          {/* Password Field */}
          <AuthInput
            label="Password"
            icon={Lock}
            type="password"
            {...register("password")}
            error={errors.password?.message}
            placeholder="••••••••"
          />

          {/* Error Message */}
          <FormError message={errorMessage} />

          {/* Submit Button */}
          <AuthButton
            type="submit"
            isLoading={isSubmitting}
            text="Sign in"
            loadingText="Signing in..."
          />
        </form>
      </div>

      {/* Footer Links */}
      <AuthFooter
        message="Don't have an account?"
        linkText="Create account"
        linkHref="/auth/register"
      />
    </>
  );
}
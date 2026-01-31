"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, UserCircle } from "lucide-react";
import api from "@/lib/axios";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { registerSchema } from "@/lib/validators/registerSchema";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthSelect } from "@/components/auth/AuthSelect";
import { getErrorMessage } from "@/lib/errorHandler";
import { FormError } from "@/components/auth/FormError";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthFooter } from "@/components/auth/AuthFooter";


type RegisterFormValues = z.infer<typeof registerSchema>;

const ROLE_OPTIONS = [
  { value: "EMPLOYEE", label: "Employee - Track and manage tasks" },
  { value: "MANAGER", label: "Manager - Oversee team and analytics" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "EMPLOYEE",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setErrorMessage(null);

    try {
      await api.post("/auth/register", data);

      router.push("/auth/signin?registered=true");
    } catch (error) {

      const message = getErrorMessage(error);
      setErrorMessage(message);
      console.error("Auth action failed:", error);
    }
  };

  return (
    <>
      <AuthHeader
        title="Create your account"
        subtitle="Join your team and start managing tasks"
      />

      {/* Register Form */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name Field */}
          <AuthInput
            label="Full name"
            icon={User}
            {...register("name")}
            error={errors.name?.message}
            placeholder="John Doe"
          />


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

          {/* Role Selection */}
          <AuthSelect
            label="Select your role"
            icon={UserCircle}
            options={ROLE_OPTIONS}
            {...register("role")}
            error={errors.role?.message}
          />

          {/* Error Message */}
          <FormError message={errorMessage} />

          {/* Submit Button */}
          <AuthButton
            type="submit"
            isLoading={isSubmitting}
            text="Create account"
            loadingText="Creating account..."
          />
        </form>
      </div>

      {/* Footer Links */}
      <AuthFooter
        message="Already have an account?"
        linkText="Sign in"
        linkHref="/auth/signin"
      />
    </>
  );
}

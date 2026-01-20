"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Mail, Lock, Loader2, AlertCircle } from "lucide-react";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function SignInPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(data: FormValues) {
    setErrorMessage(null);

    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (!res) {
      setErrorMessage("Login failed. Please try again.");
      return;
    }

    if (res.ok) {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      if (session) {
        router.push("/")
      }
    } else {
      setErrorMessage("Invalid email or password");
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TeamPilot AI
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  {...register("email")}
                  type="email"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all ${errors.email
                    ? "border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  {...register("password")}
                  type="password"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all ${errors.password
                    ? "border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                <p className="text-red-700 text-sm">{errorMessage}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password too short"),
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

    // signIn with credentials, redirect: false so we can handle result client-side
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    // res could be undefined if network error — defensively handle
    if (!res) {
      setErrorMessage("Login failed (network). Try again.");
      return;
    }

    // NextAuth returns { ok: boolean, error?: string }
    // redirect manually on success
    // Note: when redirect: false, res.ok indicates success
    if (res.ok) {
      // go to dashboard (manager) or to homepage
      router.push("/dashboard");
    } else {
      setErrorMessage(res.error ?? "Invalid credentials");
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            {...register("email")}
            type="email"
            className="w-full border p-2 rounded"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            {...register("password")}
            type="password"
            className="w-full border p-2 rounded"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {errorMessage && (
          <div className="text-red-600 text-sm">{errorMessage}</div>
        )}

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>

          <a href="/auth/register" className="text-sm text-blue-600 hover:underline">
            Create account
          </a>
        </div>
      </form>
    </main>
  );
}

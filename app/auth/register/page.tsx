"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["MANAGER", "EMPLOYEE"]).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(data: FormValues) {
    setErrorMessage(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        // optional: redirect to sign in
        router.push("/auth/signin");
      } else {
        const json = await res.json();
        setErrorMessage(json?.error || "Registration failed");
      }
    } catch (err) {
      setErrorMessage("Network error");
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input {...register("name")} placeholder="Name" className="w-full border p-2 rounded" />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <input {...register("email")} placeholder="Email" className="w-full border p-2 rounded" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <input {...register("password")} type="password" placeholder="Password" className="w-full border p-2 rounded" />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <select {...register("role")} className="w-full border p-2 rounded">
            <option value="EMPLOYEE">Employee</option>
            <option value="MANAGER">Manager</option>
          </select>
        </div>

        {errorMessage && <div className="text-red-600 text-sm">{errorMessage}</div>}

        <div className="flex items-center gap-2">
          <button type="submit" disabled={isSubmitting} className="bg-black text-white px-4 py-2 rounded disabled:opacity-60">
            {isSubmitting ? "Creating..." : "Create account"}
          </button>
          <a href="/auth/signin" className="text-sm text-blue-600 hover:underline">Back to sign in</a>
        </div>
      </form>
    </main>
  );
}

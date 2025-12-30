"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  return (
    <section className="space-y-6">
      {!session ? (
        <>
          <h1 className="text-3xl font-bold">
            Welcome to TeamPilot AI
          </h1>

          <p className="text-gray-600 max-w-xl">
            A lightweight task & team management platform with role-based access
            and AI-powered insights for managers.
          </p>

          <div className="flex gap-3">
            <Link
              href="/auth/signin"
              className="bg-black text-white px-4 py-2 rounded"
            >
              Sign in
            </Link>

            <Link
              href="/auth/register"
              className="border px-4 py-2 rounded"
            >
              Create account
            </Link>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold">
            Hello, {session.user.name ?? "there"} 👋
          </h1>

          <p className="text-gray-600">
            {session.user.role === "MANAGER"
              ? "Manage your team and track progress."
              : "Track your tasks and stay productive."}
          </p>


          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="bg-black text-white px-4 py-2 rounded"
            >
              Go to Dashboard
            </Link>

            <Link
              href="/tasks"
              className="border px-4 py-2 rounded"
            >
              View Tasks
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b bg-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="font-bold text-lg">
          TeamPilot AI
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          {session && (
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
          )}

          {session && (
            <Link href="/tasks" className="hover:underline">
              Tasks
            </Link>
          )}

          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          ) : (
            <Link href="/auth/signin" className="hover:underline">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

"use client"

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Sparkles, LogOut, LayoutDashboard, CheckSquare } from "lucide-react";

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TeamPilot AI
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {status === "loading" ? (
              <div className="h-9 w-20 bg-gray-100 animate-pulse rounded-lg"></div>
            ) : session ? (
              <>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isActive("/dashboard")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                {/* Tasks Link */}
                <Link
                  href="/tasks"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isActive("/tasks")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Tasks</span>
                </Link>

                {/* User Menu */}
                <div className="flex items-center gap-3 ml-2 pl-3 border-l border-gray-200">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-semibold text-gray-900">
                      {session.user.name}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {session.user.role.toLowerCase()}
                    </span>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-all"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Sign In Link */}
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-all"
                >
                  Sign In
                </Link>

                {/* Get Started Button */}
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}


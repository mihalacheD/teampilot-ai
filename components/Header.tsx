"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Sparkles,
  LogOut,
  LayoutDashboard,
  CheckSquare,
  Users2,
  Menu,
  X
} from "lucide-react";

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/80 md:backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setOpen(false)}
          >
            <div className="w-9 h-9 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TeamPilot AI
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            {status === "loading" ? (
              <div className="h-9 w-24 bg-gray-100 animate-pulse rounded-lg" />
            ) : session ? (
              <>
                <NavLink href="/dashboard" icon={<LayoutDashboard />} active={isActive("/dashboard")}>
                  Dashboard
                </NavLink>

                <NavLink href="/tasks" icon={<CheckSquare />} active={isActive("/tasks")}>
                  Tasks
                </NavLink>

                {session.user.role === "MANAGER" && (
                  <NavLink href="/team" icon={<Users2 />} active={isActive("/team")}>
                    Team
                  </NavLink>
                )}

                <div className="flex items-center gap-3 ml-3 pl-3 border-l">
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-semibold">{session.user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {session.user.role.toLowerCase()}
                    </p>
                  </div>

                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="px-4 py-2 hover:bg-gray-100 rounded-lg">
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-200 z-40">
          <div className="px-4 py-3 space-y-2">

            {session && (
              <>
                <MobileLink href="/dashboard" onClick={setOpen}>
                  Dashboard
                </MobileLink>
                <MobileLink href="/tasks" onClick={setOpen}>
                  Tasks
                </MobileLink>

                {session.user.role === "MANAGER" && (
                  <MobileLink href="/team" onClick={setOpen}>
                    Team
                  </MobileLink>
                )}

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------- Helpers ---------- */

function NavLink({
  href,
  children,
  icon,
  active,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-baseline-last gap-2 px-4 py-2 rounded-lg font-medium transition
        ${active ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}
      `}
    >
      <span className="w-4 h-4 mr-2">{icon}</span>
      <span>{children}</span>
    </Link>
  );
}

function MobileLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: (v: boolean) => void;
}) {
  return (
    <Link
      href={href}
      onClick={() => onClick(false)}
      className="block px-4 py-2 rounded-lg font-medium hover:bg-gray-100"
    >
      {children}
    </Link>
  );
}

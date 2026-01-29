"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sparkles, LogOut, LayoutDashboard, CheckSquare, Users2, Menu, X } from "lucide-react";
import { NavLink } from "./NavLink";
import { MobileLink } from "./MobileLink";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">

          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-xl tracking-tight text-gray-900">
              TeamPilot<span className="text-indigo-600">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {session && (
              <>
                <NavLink href="/dashboard" icon={<LayoutDashboard size={18} />} active={isActive("/dashboard")}>
                  Dashboard
                </NavLink>
                <NavLink href="/tasks" icon={<CheckSquare size={18} />} active={isActive("/tasks")}>
                  Tasks
                </NavLink>
                {session.user.role === "MANAGER" && (
                  <NavLink href="/team" icon={<Users2 size={18} />} active={isActive("/team")}>
                    Team
                  </NavLink>
                )}

                <div className="h-6 w-px bg-gray-200 mx-4" />

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-gray-600 bg-gray-100 rounded-xl">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 p-4 space-y-2 shadow-2xl animate-in slide-in-from-top-2">
          {session && (
            <>
              <MobileLink href="/dashboard" icon={<LayoutDashboard />} active={isActive("/dashboard")} onClick={closeMenu}>
                Dashboard
              </MobileLink>
              <MobileLink href="/tasks" icon={<CheckSquare />} active={isActive("/tasks")} onClick={closeMenu}>
                Tasks
              </MobileLink>
              {session.user.role === "MANAGER" && (
                <MobileLink href="/team" icon={<Users2 />} active={isActive("/team")} onClick={closeMenu}>
                  Team
                </MobileLink>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-3 px-4 py-4 text-red-600 font-bold bg-red-50 rounded-xl"
              >
                <LogOut size={20} /> Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
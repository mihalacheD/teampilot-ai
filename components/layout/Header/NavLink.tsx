import Link from "next/link";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  icon: ReactNode;
  active: boolean;
}

export function NavLink({ href, children, icon, active }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200
        ${active
          ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
      `}
    >
      <span className={`transition-colors ${active ? "text-indigo-600" : "text-gray-400"}`}>
        {icon}
      </span>
      {children}
    </Link>
  );
}
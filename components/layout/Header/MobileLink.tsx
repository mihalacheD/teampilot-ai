import Link from "next/link";
import { ReactNode } from "react";

interface MobileLinkProps {
  href: string;
  children: ReactNode;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}

export function MobileLink({ href, children, icon, active, onClick }: MobileLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors
        ${active
          ? "bg-indigo-600 text-white"
          : "text-gray-700 hover:bg-gray-100"}
      `}
    >
      <span className={active ? "text-white" : "text-gray-400"}>
        {icon}
      </span>
      {children}
    </Link>
  );
}
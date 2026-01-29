import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface QuickActionProps {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  variant?: "primary" | "secondary";
}

export function QuickActionCard({ href, title, description, icon, variant = "secondary" }: QuickActionProps) {
  const isPrimary = variant === "primary";

  return (
    <Link
      href={href}
      className={`group flex items-center justify-between p-5 rounded-2xl transition-all border-2 ${isPrimary
          ? "bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100"
          : "bg-white border-gray-100 hover:border-indigo-100 text-gray-900 hover:bg-indigo-50/30"
        }`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl ${isPrimary ? "bg-white/20" : "bg-indigo-50 text-indigo-600"}`}>
          {icon}
        </div>
        <div>
          <p className="font-bold">{title}</p>
          <p className={`text-xs ${isPrimary ? "text-indigo-100" : "text-gray-500"}`}>{description}</p>
        </div>
      </div>
      <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isPrimary ? "text-white" : "text-gray-300"}`} />
    </Link>
  );
}
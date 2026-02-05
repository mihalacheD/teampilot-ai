"use client";

import { Eye } from "lucide-react";
import { useSession } from "next-auth/react";

export function DemoBanner() {
  const { data: session } = useSession();

  if (!session || !session.user?.isDemo) return null;

  const isManager = session.user.role === "MANAGER";

  return (
    <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">
              Demo Mode – {isManager ? "Manager" : "Employee"} View
            </p>
            <p className="text-xs text-blue-100">
              This is a read-only demo. Create an account to manage real data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RoleBadgeProps {
  role: "MANAGER" | "EMPLOYEE";
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const isManager = role === "MANAGER";

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase ${isManager ? "bg-indigo-50 text-indigo-700" : "bg-emerald-50 text-emerald-700"
        }`}>
        <span className={`w-2 h-2 rounded-full animate-pulse ${isManager ? "bg-indigo-500" : "bg-emerald-500"}`}></span>
        Logged in as {role}
      </span>
    </div>
  );
}
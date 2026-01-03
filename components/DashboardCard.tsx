import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "blue" | "green" | "purple";
  link?: string;
  children: React.ReactNode;
}

export default function DashboardCard({ icon, title, description, color, link, children }: DashboardCardProps) {
  const iconColors = {
    blue: "from-blue-600 to-indigo-600",
    green: "from-green-600 to-emerald-600",
    purple: "from-purple-600 to-indigo-600",
  };

  const content = (
    <>
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-10 h-10 bg-linear-to-br ${iconColors[color]} rounded-lg flex items-center justify-center text-white shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        {link && (
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all shrink-0" />
        )}
      </div>
      {children}
    </>
  );

  if (link) {
    return (
      <Link href={link} className="group block bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
        {content}
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      {content}
    </div>
  );
}
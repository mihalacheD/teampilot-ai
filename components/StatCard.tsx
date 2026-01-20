
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: "blue" | "green" | "yellow" | "purple" | "red";
}

export default function StatCard({ icon, title, value, subtitle, color }: StatCardProps) {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-600",
    green: "from-green-50 to-green-100 border-green-200 text-green-600",
    yellow: "from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-600",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-600",
    red: "from-red-50 to-red-100 border-red-200 text-red-600",
  };

  const iconColors = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    purple: "text-purple-600",
    red: "text-red-600",
  };


  return (
    <div className={`bg-linear-to-br ${colorClasses[color]} rounded-xl p-6 border`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">{title}</span>
        <div className={iconColors[color]}>
          {icon}
        </div>

      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-600">{subtitle}</p>
    </div>
  );
}








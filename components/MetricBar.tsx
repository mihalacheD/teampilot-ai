

export default function MetricBar({ label, percentage, color }: { label: string; percentage: number; color: "green" | "yellow" | "red" }) {
  const barColors = {
    green: "from-green-500 to-emerald-500",
    yellow: "from-yellow-500 to-orange-500",
    red: "from-red-500 to-rose-500",
  };

  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-900">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`bg-linear-to-r ${barColors[color]} h-2 rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
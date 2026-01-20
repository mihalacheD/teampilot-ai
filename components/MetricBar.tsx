import { TaskStatus, statusBarStyles } from "@/lib/constants/task-status";

type Props = {
  label: string;
  percentage: number;
  status: TaskStatus;
};

export default function MetricBar({ label, percentage, status }: Props) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-900">{percentage}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full bg-linear-to-r ${statusBarStyles[status]} transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

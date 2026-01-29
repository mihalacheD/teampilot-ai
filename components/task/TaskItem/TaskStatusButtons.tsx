import { TaskStatus, statusStyles } from "@/lib/constants/task-status";

type Props = {
  taskId: string;
  currentStatus: TaskStatus;
  canChange: boolean;
  isLoading?: boolean;
  onStatusChange: (id: string, status: TaskStatus) => void;
};

export function StatusButtons({ taskId, currentStatus, canChange, isLoading, onStatusChange }: Props) {
  const statuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
      {statuses.map((status) => (
        <button
          key={status}
          disabled={isLoading || !canChange}
          onClick={() => onStatusChange(taskId, status)}
          className={`px-2 md:px-3 py-1 md:py-1.5 text-[9px] md:text-[10px] font-bold rounded-md transition-all ${
            currentStatus === status ? statusStyles[status] : "text-gray-500 hover:bg-white hover:text-gray-700"
          } ${isLoading || !canChange ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span className="hidden sm:inline">{status.replace("_", " ")}</span>
          <span className="sm:hidden">
            {status === "TODO" ? "TO" : status === "IN_PROGRESS" ? "IP" : "DN"}
          </span>
        </button>
      ))}
    </div>
  );
}
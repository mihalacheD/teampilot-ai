import { TaskStatus, statusStyles } from "@/lib/constants/task-status";

export default function TaskPreview({ title, status }: { title: string; status: TaskStatus }) {
  const statusLabels: Record<TaskStatus, string> = {
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    DONE: "Done",
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-all mb-2">
      <span className="text-sm font-medium text-gray-700 truncate flex-1 pr-2">
        {title}
      </span>
      <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-md ${statusStyles[status]}`}>
        {statusLabels[status]}
      </span>
    </div>
  );
}
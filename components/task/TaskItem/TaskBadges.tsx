import { Calendar, AlertTriangle, Flag } from "lucide-react";
import { formatDate } from "@/lib/date";
import { Priority, priorityLabels, priorityStyles } from "@/lib/constants/priority";

export function DueDateBadge({ dueDate, isOverdue }: { dueDate: string; isOverdue: boolean }) {
  return (
    <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-1 text-xs text-gray-500">
      <span className={`flex items-center gap-1.5 text-sm ${isOverdue ? "text-red-600 font-medium" : "text-gray-500"}`}>
        <Calendar className="w-3.5 h-3.5" />
        {formatDate(dueDate)}
      </span>
      {isOverdue && (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded-md shrink-0">
          <AlertTriangle className="w-3.5 h-3.5" />
          Overdue
        </span>
      )}
    </div>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${priorityStyles[priority]}`}>
      <Flag className="w-4 h-4" />
      {priorityLabels[priority]}
    </span>
  );
}
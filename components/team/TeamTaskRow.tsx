import { Task } from "@prisma/client";
import { Flag, Calendar, AlertTriangle } from "lucide-react";
import { formatDate } from "@/lib/date";
import { Priority, priorityLabels, priorityStyles } from "@/lib/constants/priority";
import { TaskStatus, statusStyles } from "@/lib/constants/task-status";
import { statusLabels } from "@/lib/task-metrics";

export function MemberTaskRow({ task }: { task: Task }) {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && task.status !== "DONE" && dueDate < new Date();

  return (
    <div className={`rounded-xl p-4 transition border ${isOverdue ? "bg-red-50 border-red-200" : "bg-white border-gray-100 hover:shadow-sm"
      }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-1">{task.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            {/* Priority */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-sm ${priorityStyles[task.priority as Priority]}`}>
              <Flag className="w-3.5 h-3.5" />
              {priorityLabels[task.priority as Priority]}
            </span>

            {/* Status */}
            <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md ${statusStyles[task.status as TaskStatus]}`}>
              {statusLabels[task.status as TaskStatus]}
            </span>

            {/* Date */}
            <span className={`flex items-center gap-1.5 text-xs ${isOverdue ? "text-red-600 font-medium" : "text-gray-500"}`}>
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(task.dueDate)}
            </span>

            {isOverdue && (
              <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-red-700 bg-red-100 rounded-md">
                <AlertTriangle className="w-3 h-3" />
                OVERDUE
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
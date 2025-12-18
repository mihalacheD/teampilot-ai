"use client";

import { TaskStatus, statusStyles } from "@/lib/constants/task-status";


type TaskItemProps = {
  task: {
    id: string;
    title: string;
    status: TaskStatus;
  };
  isLoading?: boolean;
  onStatusChange: (id: string, status: TaskStatus) => void;
};

export function TaskItem({ task, isLoading, onStatusChange }: TaskItemProps) {
  return (
    <li className="border p-3 rounded-md flex justify-between items-center">
      <span className="font-medium">{task.title}</span>

      <div className="flex gap-2">
        {(["TODO", "IN_PROGRESS", "DONE"] as TaskStatus[]).map((status) => (
          <button
            key={status}
            disabled={isLoading}
            onClick={() => onStatusChange(task.id, status)}
            className={`px-2 py-1 text-xs rounded-full transition
                ${task.status === status
                ? statusStyles[status]
                : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              }
             ${isLoading
                ? "opacity-50 cursor-not-allowed"
                : ""}
  `}
          >

            {status.replace("_", " ")}
          </button>
        ))}
      </div>
    </li>
  );
}

"use client";

import { TaskStatus, statusStyles } from "@/lib/constants/task-status";
import { Trash2 } from "lucide-react";
import { useState } from "react";



type TaskItemProps = {
  task: {
    id: string;
    title: string;
    status: TaskStatus;
  };
  isLoading?: boolean;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
};

export function TaskItem({ task, isLoading, onStatusChange, onEdit, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  return (
      <li className="group border p-3 rounded-md flex justify-between items-center">
        {isEditing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onEdit(task.id, title);
                setIsEditing(false);
              }
              if (e.key === 'Escape') {
                setTitle(task.title);
                setIsEditing(false);
              }
            }}
            className="border px-2 py-1 tesxt-sm rounded"
          />
        ) : (
          <span
            onClick={() => setIsEditing(true)}
            className="font-medium cursor-pointer hover:underline"
          >
            {task.title}
          </span>
        )}

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
        <button
          onClick={() => {
            if (confirm("Delete this task?")) {
              onDelete(task.id);
            }
          }}
          disabled={isLoading}
          className={`p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all
            opacity-0 group-hover:opacity-100
            ${isLoading ? "invisible" : "visible"}
          `}
          title="Șterge task"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </li>
  );
}

"use client";

import { TaskStatus, statusStyles } from "@/lib/constants/task-status";
import { Trash2, Lock } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { canDeleteTask, canEditTask, canChangeTaskStatus } from "../lib/validators/permissions";


type TaskItemProps = {
  task: {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    userId: string;
  };
  isLoading?: boolean;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onEdit: (id: string, updates: { title: string; description: string }) => void;
  onDelete: (id: string) => void;
};

export function TaskItem({ task, isLoading, onStatusChange, onEdit, onDelete }: TaskItemProps) {
  const { data: session } = useSession();

  const [isEditing, setIsEditing] = useState(false);

  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || "");

  const [isExpanded, setIsExpanded] = useState(false);

  if (!session) return null;

  const userRole = session.user.role as "MANAGER" | "EMPLOYEE";
  const currentUserId = session.user.id;

  // Verifică permisiunile
  const canEdit = canEditTask(userRole, task.userId, currentUserId);
  const canDelete = canDeleteTask(userRole, task.userId, currentUserId);
  const canChangeStatus = canChangeTaskStatus(userRole, task.userId, currentUserId);

  const handleSave = () => {
    onEdit(task.id, {
      title: editTitle,
      description: editDesc
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDesc(task.description || "");
    setIsEditing(false);
  };

  return (
    <li className="group border p-4 rounded-lg flex justify-between items-start gap-4 bg-white hover:shadow-sm transition-shadow">
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="font-semibold text-sm border-b border-blue-400 outline-none w-full"
              placeholder="Task title..."
            />
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="text-sm text-gray-500 border rounded p-2 w-full outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="Description..."
              rows={3}
            />
            <div className="flex gap-2 mt-1">
              <button onClick={handleSave} className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                Save
              </button>
              <button onClick={handleCancel} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="group/text">
            <h3
              onClick={() => canEdit && setIsEditing(true)}
              className={`font-semibold text-gray-900 ${canEdit ? "cursor-pointer hover:text-blue-600" : "cursor-default"} transition-colors`}
            >
              {task.title}
              {!canEdit && <Lock className="inline ml-2 w-3 h-3 text-gray-400" />}
            </h3>

            {task.description ? (
              <div className="mt-1">
                <p
                  onClick={() => !isExpanded && canEdit && setIsEditing(true)}
                  className={`text-sm text-gray-500 whitespace-pre-wrap wrap-break-words ${canEdit ? "cursor-pointer" : "cursor-default"} transition-all
                    ${isExpanded ? "line-clamp-none" : "line-clamp-3"}`}
                >
                  {task.description}
                </p>
                {task.description.length > 100 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsExpanded(!isExpanded);
                    }}
                    className="text-[11px] font-bold uppercase tracking-wider text-blue-500 hover:text-blue-700 mt-1 block"
                  >
                    {isExpanded ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            ) : (
              canEdit && (
                <p
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-gray-300 italic mt-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  Click to add description...
                </p>
              )
            )}
          </div>
        )}
      </div>

      {/* Status și buton de ștergere */}
      <div className="flex flex-col items-end gap-3 shrink-0">
        <div className="flex gap-1 bg-gray-50 p-1 rounded-md">
          {(["TODO", "IN_PROGRESS", "DONE"] as TaskStatus[]).map((status) => (
            <button
              key={status}
              disabled={isLoading || !canChangeStatus}
              onClick={() => canChangeStatus && onStatusChange(task.id, status)}
              className={`px-2 py-1 text-[10px] font-bold rounded transition
                ${task.status === status ? statusStyles[status] : "text-gray-400 hover:bg-white"}
                ${isLoading || !canChangeStatus ? "opacity-50 cursor-not-allowed" : ""}
              `}
              title={!canChangeStatus ? "Only the task owner can change status" : ""}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>

        {canDelete ? (
          <button
            onClick={() => confirm("Do you want to delete this task?") && onDelete(task.id)}
            disabled={isLoading}
            className="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 size={16} />
          </button>
        ) : (
          <div className="p-1.5 text-gray-200 cursor-not-allowed opacity-0 group-hover:opacity-100" title="Only managers can delete tasks">
            <Lock size={16} />
          </div>
        )}
      </div>
    </li>
  );
}
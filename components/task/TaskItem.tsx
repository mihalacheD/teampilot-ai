"use client";

import { TaskStatus, statusStyles } from "@/lib/constants/task-status";
import { Trash2, Lock, Edit2, Save, X, AlertTriangle, Calendar, Flag } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { formatDate } from "@/lib/date";
import { Priority, priorityLabels, priorityStyles } from "@/lib/constants/priority";
import { canChangeTaskStatus, canDeleteTask, canEditTask } from "@/lib/validators/permissions";

type TaskItemProps = {
  task: {
    id: string;
    title: string;
    description: string | null;
    priority: Priority;
    status: TaskStatus;
    userId: string;
    dueDate?: string | null;
    user?: {
      id: string;
      name: string | null;
      email: string | null;
    };
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

  const assignedLabel =
    task.user?.name ||
    task.user?.email ||
    (task.userId === currentUserId ? "You" : "Unknown");


  const permissionCtx = { role: userRole, taskUserId: task.userId, currentUserId, isDemo: false };
  const canEdit = canEditTask(permissionCtx);
  const canDelete = canDeleteTask(permissionCtx);
  const canChangeStatus = canChangeTaskStatus(permissionCtx);

  const handleSave = () => {
    if (!canEdit) return;
    onEdit(task.id, { title: editTitle, description: editDesc });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDesc(task.description || "");
    setIsEditing(false);
  };

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;

  const isOverdue = dueDate && task.status !== "DONE" && dueDate < new Date();



  return (
    <li className={`group ${isOverdue ? "bg-red-50 border border-red-200" : "bg-white border border-gray-100 hover:shadow-sm"} rounded-2xl border border-gray-200 p-4 md:p-5 shadow-sm hover:shadow-md transition-all flex-1 min-w-0 order-2 md:order-1 overflow-hidden`}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 md:gap-4">
        {/* Content Area */}
        <div className="flex-1 min-w-0 order-2 md:order-1">
          {isEditing ? (
            <div className="space-y-3">
              <input
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-4 py-2 text-base font-semibold border-2 border-blue-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Task title..."
              />
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none"
                placeholder="Add description..."
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1 min-w-0 w-full">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3
                    onClick={() => canEdit && setIsEditing(true)}
                    className={`text-base font-semibold text-gray-900 wrap-break-word overflow-hidden ${canEdit
                      ? "cursor-pointer hover:text-blue-600"
                      : "cursor-default"
                      } transition-colors`}
                  >
                    {task.title}
                    {!canEdit && <Lock className="inline ml-2 w-3.5 h-3.5 text-gray-400" />}
                  </h3>

                  {/* Assigned badge */}
                  {task.user && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border
                          ${task.userId === currentUserId
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-indigo-50 text-indigo-700 border-indigo-200"
                        }`}
                    >
                      Assigned to {assignedLabel}
                    </span>

                  )}
                </div>

              </div>

              {task.description ? (
                <div className="mt-2">
                  <p
                    onClick={() => !isExpanded && canEdit && setIsEditing(true)}
                    className={`text-sm text-gray-600 whitespace-pre-wrap wrap-break-words ${canEdit ? "cursor-pointer" : "cursor-default"
                      } ${isExpanded ? "" : "line-clamp-2"}`}
                  >
                    {task.description}
                  </p>
                  {task.description.length > 100 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                      }}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 mt-1.5 inline-block"
                    >
                      {isExpanded ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>
              ) : (
                canEdit && (
                  <p
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-gray-400 italic mt-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    Click to add description...
                  </p>
                )
              )}
            </>
          )}
        </div>

        {/* Due date */}
        {task.dueDate && (
          <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-1 text-xs text-gray-500">
            <span className={`flex items-center gap-1.5 text-sm
               ${isOverdue ? "text-red-600 font-medium" : "text-gray-500"}`}>
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(task.dueDate)}
            </span>

            {isOverdue && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-100 rounded-md shrink-0">
                <AlertTriangle className="w-3.5 h-3.5" />
                Overdue
              </span>
            )}
          </div>
        )}


        {/* Actions Area */}
        <div className="flex md:flex-col items-end gap-4 shrink-0 order-1 md:order-2">

          {/* Priority Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${priorityStyles[task.priority]}`}>
            <Flag className="w-4 h-4" />
            {priorityLabels[task.priority]}
          </span>

          {/* Status Buttons */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {(["TODO", "IN_PROGRESS", "DONE"] as TaskStatus[]).map((status) => (
              <button
                key={status}
                disabled={isLoading || !canChangeStatus}
                onClick={() => canChangeStatus && onStatusChange(task.id, status)}
                className={`px-2 md:px-3 py-1 md:py-1.5 text-[9px] md:text-[10px] font-bold rounded-md transition-all ${task.status === status
                  ? statusStyles[status]
                  : "text-gray-500 hover:bg-white hover:text-gray-700"
                  } ${isLoading || !canChangeStatus ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span className="hidden sm:inline">{status.replace("_", " ")}</span>
                <span className="sm:hidden">
                  {status === "TODO" ? "TO" : status === "IN_PROGRESS" ? "IP" : "DN"}
                </span>
              </button>
            ))}
          </div>

          {/* Edit + Delete Group */}
          {(canEdit || canDelete) && (
            <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              {canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Edit task"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}

              {canDelete ? (
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this task?")) {
                      onDelete(task.id);
                    }
                  }}
                  disabled={isLoading}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              ) : (
                <div
                  className="p-2 text-gray-300 cursor-not-allowed"
                  title="Only managers can delete tasks"
                >
                  <Lock className="w-4 h-4" />
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </li >
  );
}
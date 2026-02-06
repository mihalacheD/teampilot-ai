"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Edit2, Trash2, Lock } from "lucide-react";
import { canChangeTaskStatus, canDeleteTask, canEditTask } from "@/lib/validators/permissions";

import { ViewMode } from "./TaskViewMode";
import { EditMode } from "./TaskEditMode";
import { StatusButtons } from "./TaskStatusButtons";
import { DueDateBadge, PriorityBadge } from "./TaskBadges";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { TaskStatus } from "@/lib/constants/task-status";
import { Priority } from "@/lib/constants/priority";

export type TaskItemProps = {
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
  const [editDesc, setEditDesc] = useState(task.description ?? "");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!session) return null;

  const permissionCtx = {
    role: session.user.role,
    isDemo: session.user.isDemo ?? false,
    taskUserId: task.userId,
    currentUserId: session.user.id,
  };

  const permissions = {
    canEdit: canEditTask(permissionCtx),
    canDelete: canDeleteTask(permissionCtx),
    canChangeStatus: canChangeTaskStatus(permissionCtx),
  };

  const assignedLabel =
    task.user?.name ||
    task.user?.email ||
    (task.userId === session.user.id ? "You" : "Unknown");

  const isOverdue =
    task.dueDate &&
    task.status !== "DONE" &&
    new Date(task.dueDate) < new Date();

  return (
    <>
      <li
        className={`group rounded-2xl border p-4 md:p-5 shadow-sm transition-all overflow-hidden ${
          isOverdue ? "bg-red-50 border-red-200" : "bg-white border-gray-100 hover:shadow-md"
        }`}
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          {/* Content Area */}
          <div className="flex-1 min-w-0 order-2 md:order-1">
            {isEditing ? (
              <EditMode
                title={editTitle}
                description={editDesc}
                onTitleChange={setEditTitle}
                onDescChange={setEditDesc}
                onSave={() => {
                  onEdit(task.id, { title: editTitle, description: editDesc });
                  setIsEditing(false);
                }}
                onCancel={() => {
                  setEditTitle(task.title);
                  setEditDesc(task.description || "");
                  setIsEditing(false);
                }}
              />
            ) : (
              <ViewMode
                task={task}
                canEdit={permissions.canEdit}
                currentUserId={session.user.id}
                assignedLabel={assignedLabel}
                isExpanded={isExpanded}
                onExpand={setIsExpanded}
                onStartEdit={() => setIsEditing(true)}
              />
            )}
          </div>

          {/* Due Date & Overdue */}
          {task.dueDate && <DueDateBadge dueDate={task.dueDate} isOverdue={!!isOverdue} />}

          {/* Actions Area (Priority, Status, Edit/Delete) */}
          <div className="flex md:flex-col items-end gap-4 shrink-0 order-1 md:order-2">
            <PriorityBadge priority={task.priority} />

            <StatusButtons
              taskId={task.id}
              currentStatus={task.status}
              canChange={permissions.canChangeStatus}
              isLoading={isLoading}
              onStatusChange={onStatusChange}
            />

            <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              {permissions.canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  title="Edit task"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {permissions.canDelete ? (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              ) : (
                <div className="p-2 text-gray-300 cursor-not-allowed" title="Only managers can delete tasks">
                  <Lock className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        </div>
      </li>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => onDelete(task.id)}
        taskTitle={task.title}
      />
    </>
  );
}
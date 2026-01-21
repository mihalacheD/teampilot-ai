"use client";

import { TaskItem } from "@/components/TaskItem";
import { useTasks } from "@/hooks/useTask";
import TaskForm from "./TaskForm";
import { Priority, PRIORITIES } from "@/lib/constants/priority";
import { FolderOpen, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function TaskList() {
  const {
    tasks,
    updatingTaskId,
    createTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
    isLoading,
    error,
  } = useTasks();

  const router = useRouter();
  const searchParams = useSearchParams();
  const param = searchParams.get("priority");
  const initialFilter = param && PRIORITIES.includes(param as Priority) ? (param as Priority) : "ALL";

  const [priorityFilter, setPriorityFilter] = useState<Priority | "ALL">(initialFilter);


  const changePriorityFilter = (value: Priority | "ALL") => {
    setPriorityFilter(value);

    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL") {
      params.delete("priority");
    } else {
      params.set("priority", value);
    }

    router.replace(`?${params.toString()}`);
  };

  // =========================
  // Filtrăm task-urile după prioritate
  // =========================
  const filteredTasks =
    priorityFilter === "ALL"
      ? tasks
      : tasks.filter((t) => t.priority === priorityFilter);

  // =========================
  // Handlere
  // =========================
  const handleEdit = (id: string, updates: { title: string; description: string }) => {
    updateTask(id, updates);
  };

  // =========================
  // Loading / Error States
  // =========================
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
        <p className="text-gray-600">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-600 font-medium">Error loading tasks</p>
        <p className="text-red-500 text-sm mt-1">{error}</p>
      </div>
    );
  }

  // =========================
  // Render
  // =========================
  return (
    <div className="space-y-6">
      <TaskForm onCreate={createTask} />

      {/* Priority Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => changePriorityFilter("ALL")}
          className={`px-3 py-1.5 text-sm rounded-full border transition ${priorityFilter === "ALL"
            ? "bg-gray-900 text-white border-gray-900"
            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
        >
          All
        </button>

        {PRIORITIES.map((priority) => (
          <button
            key={priority}
            onClick={() => changePriorityFilter(priority)}
            className={`px-3 py-1.5 text-sm rounded-full border transition ${priorityFilter === priority
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
          >
            {priority}
          </button>
        ))}
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FolderOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-500">
            {priorityFilter === "ALL"
              ? "Create your first task to get started!"
              : `No ${priorityFilter.toLowerCase()} priority tasks`}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isLoading={updatingTaskId === task.id}
              onStatusChange={updateTaskStatus}
              onEdit={handleEdit}
              onDelete={deleteTask}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

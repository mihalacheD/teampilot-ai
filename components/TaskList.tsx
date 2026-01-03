"use client";

import { TaskItem } from "@/components/TaskItem";
import { useTasks } from "@/hooks/useTask";
import TaskForm from "./TaskForm";
import { FolderOpen, Loader2 } from "lucide-react";


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


  const handleEdit = (id: string, updates: { title: string; description: string }) => {
    updateTask(id, updates);
  };

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


  return (
    <div className="space-y-6">
      <TaskForm onCreate={createTask} />

      {tasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FolderOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-500">Create your first task to get started!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
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

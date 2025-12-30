import { TaskStatus } from "@/lib/constants/task-status";
import { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
};

type CreateTaskClientInput = {
  title: string;
  description?: string;
};

export function useTasks() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then(setTasks);
  }, []);

  async function createTask(data: CreateTaskClientInput) {

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to create task");
    }

    const newTask = await res.json();
    setTasks((prev) => [newTask, ...prev]);
  }

  async function updateTaskStatus(taskId: string, status: TaskStatus) {
    const previousTasks = tasks;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );

    setUpdatingTaskId(taskId);

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Update failed");
    } catch {
      setTasks(previousTasks);
      alert("Failed to update task");
    } finally {
      setUpdatingTaskId(null);
    }
  }

  async function updateTask(taskId: string, updates: Partial<Task>) {
    const previousTasks = tasks;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Update failed");
    } catch {
      setTasks(previousTasks);
      alert("Failed to update task");
    }
  }

  async function deleteTask(taskId: string) {
    const previousTasks = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
    } catch {
      setTasks(previousTasks);
      alert("Failed to delete task");
    }
  }

  return {
    tasks,
    updatingTaskId,
    createTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
  };
}

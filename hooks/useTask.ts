import { useEffect, useState } from "react";
import {
  Task,
  getTasks,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
} from "@/lib/api/tasks";
import { TaskStatus } from "@/lib/constants/task-status";
import { CreateTaskApiInput } from "@/lib/validators/task";
import { getErrorMessage } from "@/lib/errorHandler";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setIsLoading(true);
        const data = await getTasks();
        if (mounted) setTasks(data);
      } catch (err) {
        if (mounted) setError(getErrorMessage(err));
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  async function createTask(data: CreateTaskApiInput) {
    const newTask = await createTaskApi(data);
    setTasks((prev) => [newTask, ...prev]);
  }

  async function updateTaskStatus(taskId: string, status: TaskStatus) {
    const prev = tasks;

    setTasks((t) =>
      t.map((task) =>
        task.id === taskId ? { ...task, status } : task,
      ),
    );
    setUpdatingTaskId(taskId);

    try {
      await updateTaskApi(taskId, { status });
    } catch {
      setTasks(prev);
    } finally {
      setUpdatingTaskId(null);
    }
  }

  async function updateTask(taskId: string, updates: Partial<Task>) {
    const prev = tasks;

    setTasks((t) =>
      t.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task,
      ),
    );

    try {
      await updateTaskApi(taskId, updates);
    } catch {
      setTasks(prev);
    }
  }

  async function deleteTask(taskId: string) {
    const prev = tasks;

    setTasks((t) => t.filter((task) => task.id !== taskId));

    try {
      await deleteTaskApi(taskId);
    } catch {
      setTasks(prev);
    }
  }

  return {
    tasks,
    isLoading,
    error,
    updatingTaskId,
    createTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
  };
}

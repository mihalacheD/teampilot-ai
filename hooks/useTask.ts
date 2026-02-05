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
import { toast } from "sonner";

type ApiError = {
  message: string;
  data?: {
    isDemo?: boolean;
    message?: string;
  };
};

function isDemoError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as ApiError).data === "object" &&
    (error as ApiError).data?.isDemo === true
  );
}

function showDemoToast() {
  toast.info("Demo Mode", {
    description:
      "This action is disabled in demo mode. Sign up to create your own workspace!",
    duration: 3000,
  });
}

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
    try {
      const newTask = await createTaskApi(data);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      if (isDemoError(err)) {
        showDemoToast();
      } else {
        toast.error("Failed to create task", {
          description: getErrorMessage(err),
        });
      }
      throw err;
    }
  }

  async function updateTaskStatus(taskId: string, status: TaskStatus) {
    const prev = tasks;

    // Optimistic update
    setTasks((t) =>
      t.map((task) => (task.id === taskId ? { ...task, status } : task))
    );
    setUpdatingTaskId(taskId);

    try {
      await updateTaskApi(taskId, { status });
    } catch (err) {
      // Revert on error
      setTasks(prev);

      if (isDemoError(err)) {
        showDemoToast();
      } else {
        toast.error("Failed to update task", {
          description: getErrorMessage(err),
        });
      }
    } finally {
      setUpdatingTaskId(null);
    }
  }

  async function updateTask(taskId: string, updates: Partial<Task>) {
    const prev = tasks;

    // Optimistic update
    setTasks((t) =>
      t.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );

    try {
      await updateTaskApi(taskId, updates);
    } catch (err) {
      // Revert on error
      setTasks(prev);

      if (isDemoError(err)) {
        showDemoToast();
      } else {
        toast.error("Failed to update task", {
          description: getErrorMessage(err),
        });
      }
    }
  }

  async function deleteTask(taskId: string) {
    const prev = tasks;

    // Optimistic update
    setTasks((t) => t.filter((task) => task.id !== taskId));

    try {
      await deleteTaskApi(taskId);
      toast.success("Task deleted successfully");
    } catch (err) {
      // Revert on error
      setTasks(prev);

      if (isDemoError(err)) {
        showDemoToast();
      } else {
        toast.error("Failed to delete task", {
          description: getErrorMessage(err),
        });
      }
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
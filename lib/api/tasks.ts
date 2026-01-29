import { TaskStatus } from "@/lib/constants/task-status";
import { CreateTaskApiInput } from "@/lib/validators/task";
import api from "../axios";
import { Priority } from "../constants/priority";

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  userId: string;
  dueDate?: string | null;
};

export async function getTasks(): Promise<Task[]> {
  const { data } = await api.get<Task[]>("/tasks");
  return data;
}

export async function createTaskApi(input: CreateTaskApiInput): Promise<Task> {
  const { data } = await api.post<Task>("/tasks", input);
  return data;
}

export async function updateTaskApi(
  taskId: string,
  updates: Partial<Task>,
): Promise<Task> {
  const { data } = await api.patch<Task>(`/tasks/${taskId}`, updates);
  return data;
}

export async function deleteTaskApi(taskId: string): Promise<void> {
  await api.delete(`/tasks/${taskId}`);
}

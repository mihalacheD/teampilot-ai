import { z } from "zod";

const PriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(50, "Title is too long (max 50 chars)"),
  description: z.string().max(500).optional(),
  priority: PriorityEnum.default("MEDIUM"),
  userId: z.string().min(1,"Invalid user ID"),
  dueDate: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const createTaskClientSchema = z.object({
  title: z.string().min(1, "Title is required").max(50, "Title is too long (max 50 chars)"),
  description: z.string().max(500).optional(),
  dueDate: z.string().optional(),
});

export type CreateTaskClientInput = z.infer<
  typeof createTaskClientSchema
>;

export type CreateTaskApiInput = {
  title: string,
  description?: string,
  userId: string,
  dueDate: string | null,
};

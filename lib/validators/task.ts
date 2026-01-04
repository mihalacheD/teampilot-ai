import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long (max 100 chars)"),
  description: z.string().max(500).optional(),
  userId: z.string().uuid("Invalid user ID"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const createTaskClientSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long (max 100 chars)"),
  description: z.string().max(500).optional(),
});

export type CreateTaskClientInput = z.infer<
  typeof createTaskClientSchema
>;

export type CreateTaskApiInput = {
  title: string;
  description?: string;
  userId: string;
};

import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().max(500).optional(),
  userId: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const createTaskClientSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export type CreateTaskClientInput = z.infer<
  typeof createTaskClientSchema
>;
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
  userId: z.string().uuid("Invalid user ID"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

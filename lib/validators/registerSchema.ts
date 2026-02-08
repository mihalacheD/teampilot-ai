import z from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password too long"),
  role: z.literal("EMPLOYEE"),
});

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validators/registerSchema";
import { badRequestResponse, successResponse } from "@/lib/api/api-helpers";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return badRequestResponse(
        validation.error.issues[0]?.message || "Invalid input",
      );
    }

    const { name, email, password, role } = validation.data;

    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return badRequestResponse("Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "EMPLOYEE",
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return successResponse(user, 201);
  } catch (error) {
    console.error("[REGISTER_ERROR]:", error);
    return badRequestResponse(
      error instanceof Error ? error.message : "Registration failed",
    );
  }
}

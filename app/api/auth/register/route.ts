import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validators/registerSchema";
import { badRequestResponse, successResponse } from "@/lib/api/api-helpers";


export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validare input (Zod)
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return badRequestResponse(validation.error.issues[0]?.message || "Invalid input");
    }

    const { name, email, password } = validation.data;

    // 2. LIMITARE: Verifică numărul total de utilizatori
    const userCount = await prisma.user.count();
    const MAX_USERS = 50; // Poți pune ce limită vrei tu

    if (userCount >= MAX_USERS) {
      return badRequestResponse(
        "Registration limit reached for this demo. Please use the Demo Login instead."
      );
    }

    // 3. Verifică dacă user-ul există deja
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return badRequestResponse("Email already registered");
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Creare utilizator (Rol forțat la EMPLOYEE)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "EMPLOYEE",
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
      error instanceof Error ? error.message : "Registration failed"
    );
  }
}
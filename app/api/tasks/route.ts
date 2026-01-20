import { prisma } from "@/lib/prisma";
import { createTaskSchema } from "@/lib/validators/task";
import { NextResponse } from "next/server";
import { requireManagerSession } from "@/lib/authServer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/tasks
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const isManager = session.user.role === "MANAGER";

  const tasks = await prisma.task.findMany({
    where: isManager ? {} : { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json(tasks);
}

// POST /api/tasks
export async function POST(req: Request) {
  const resultSession = await requireManagerSession();

  // Verificăm dacă rezultatul este un Response (erore 401/403)
  if (resultSession instanceof Response) {
    return resultSession;
  }

  try {
    const body = await req.json();
    const validation = createTaskSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.flatten() },
        { status: 400 }
      );
    }
    const { title, description, userId, dueDate } = validation.data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Assigned user not found" },
        { status: 404 }
      );
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        userId,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (err) {
    console.error("[TASKS_POST_ERROR]:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

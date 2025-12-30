import { prisma } from "@/lib/prisma";
import { createTaskSchema } from "@/lib/validators/task";
import { NextResponse } from "next/server";
import { requireManagerSession } from "@/lib/authServer";


// GET /api/tasks
export async function GET() {
  const session = await requireManagerSession();
  if (!(session instanceof Object)) return session;

  const tasks = await prisma.task.findMany({
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

  // Din acest punct, TypeScript știe sigur că resultSession este Session
  const session = resultSession;

  try {
    const body = await req.json();
    const validation = createTaskSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { title, description } = validation.data;

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        userId: session.user.id,
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

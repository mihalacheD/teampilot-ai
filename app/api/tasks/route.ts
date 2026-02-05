import { prisma } from "@/lib/prisma";
import { createTaskSchema } from "@/lib/validators/task";
import {
  getAuthenticatedSession,
  unauthorizedResponse,
  notFoundResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
  forbiddenResponse,
} from "@/lib/api/api-helpers";
import { requireNotDemo } from "@/lib/demo/require-not-demo";

// GET /api/tasks
export async function GET() {
  const session = await getAuthenticatedSession();

  if (!session) {
    return unauthorizedResponse();
  }

  try {
    const isManager = session.user.role === "MANAGER";

    const tasks = await prisma.task.findMany({
      where: isManager ? {} : { userId: session.user.id },
      orderBy: [{ status: "asc" }, { priority: "desc" }, { createdAt: "desc" }],
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

    return successResponse(tasks);
  } catch (error) {
    console.error("[TASKS_GET_ERROR]:", error);
    return serverErrorResponse();
  }
}

// POST /api/tasks
export async function POST(req: Request) {
  const session = await getAuthenticatedSession();

  if (!session) {
    return unauthorizedResponse();
  }

  const demoBlock = await requireNotDemo("creating tasks");
  if (demoBlock) return demoBlock;


  if (session.user.role !== "MANAGER") {
    return forbiddenResponse("Only managers can create tasks", {
      isDemo: false,
    });
  }

  try {
    const body = await req.json();

    // Validate input
    const validation = createTaskSchema.safeParse(body);
    if (!validation.success) {
      return badRequestResponse(
        validation.error.issues[0]?.message || "Invalid task data",
      );
    }

    const { title, description, priority, userId, dueDate } = validation.data;

    // Verify user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return notFoundResponse("Assigned user not found");
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        userId,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
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

    return successResponse(task, 201);
  } catch (error) {
    console.error("[TASKS_POST_ERROR]:", error);
    return serverErrorResponse();
  }
}

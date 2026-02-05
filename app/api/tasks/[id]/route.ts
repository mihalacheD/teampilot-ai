import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  getAuthenticatedSession,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
} from "@/lib/api/api-helpers";
import { requireNotDemo } from "@/lib/demo/require-not-demo";

const updateTaskSchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  title: z.string().min(1).max(50).optional(),
  description: z.string().max(500).optional(),
});

// PATCH /api/tasks/[id]
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAuthenticatedSession();

  if (!session) {
    return unauthorizedResponse();
  }

  const demoBlock = await requireNotDemo("updating tasks");
  if (demoBlock) return demoBlock;

  try {
    const body = await req.json();
    const { id } = await params;

    // Validate input
    const validation = updateTaskSchema.safeParse(body);
    if (!validation.success) {
      return badRequestResponse(
        validation.error.issues[0]?.message || "Invalid update data",
      );
    }

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return notFoundResponse("Task not found");
    }

    // Permission check: Employees can only edit their own tasks
    if (
      session.user.role === "EMPLOYEE" &&
      existingTask.userId !== session.user.id
    ) {
      return forbiddenResponse("You can only edit your own tasks", {
        isDemo: false,
      });
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: validation.data,
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

    return successResponse(updatedTask);
  } catch (error) {
    console.error("[TASK_PATCH_ERROR]:", error);
    return serverErrorResponse();
  }
}

// DELETE /api/tasks/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAuthenticatedSession();

  if (!session) {
    return unauthorizedResponse();
  }

  const demoBlock = await requireNotDemo("deleting tasks");
  if (demoBlock) return demoBlock;

  if (session.user.role !== "MANAGER") {
    return forbiddenResponse("Only managers can delete tasks", {
      isDemo: false,
    });
  }

  try {
    const { id } = await params;

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return notFoundResponse("Task not found");
    }

    // Delete task
    await prisma.task.delete({
      where: { id },
    });

    return successResponse({ success: true, message: "Task deleted" });
  } catch (error) {
    console.error("[TASK_DELETE_ERROR]:", error);
    return serverErrorResponse();
  }
}

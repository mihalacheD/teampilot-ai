import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const updateStatusSchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  title: z.string().min(1).optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const result = updateStatusSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const { id } = await params;

  const existingTask = await prisma.task.findUnique({
    where: { id: id },
  });

  if (!existingTask) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  if (
    session.user.role === "EMPLOYEE" &&
    existingTask.userId !== session.user.id
  ) {
    return NextResponse.json(
      { error: "You can only edit your own tasks" },
      { status: 403 }
    );
  }

  const task = await prisma.task.update({
    where: { id: id },
    data: result.data,
  });

  return NextResponse.json(task);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "MANAGER") {
    return NextResponse.json(
      { error: "Only managers can delete tasks" },
      { status: 403 }
    );
  }
  const { id } = await params;

  await prisma.task.delete({
    where: { id: id },
  });

  return NextResponse.json({ success: true });
}

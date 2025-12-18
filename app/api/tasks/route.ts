import { prisma } from "@/lib/prisma";
import { createTaskSchema } from "@/lib/validators/task";
import { NextResponse } from "next/server";

//GET api tasks
export async function GET() {
  const tasks = await prisma.task.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(tasks);
}

//POST api tasks
export async function POST(req: Request) {
  const body = await req.json();

  const result = createTaskSchema.safeParse(body);


  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.flatten() },
      { status: 400 }
    );
  }

   const { title, description, userId } = result.data;

  const newTask = await prisma.task.create({
    data: {
      title,
      description,
      userId,
    },
  });
  return NextResponse.json(newTask, { status: 201 });
}

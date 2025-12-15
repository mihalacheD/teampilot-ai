import { prisma } from "@/lib/prisma";
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
  const { title, description, userId } = body;

  if (!title || !userId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const newTask = await prisma.task.create({
    data: {
      title,
      description,
      userId,
    },
  });
  return NextResponse.json(newTask, { status: 201 });
}

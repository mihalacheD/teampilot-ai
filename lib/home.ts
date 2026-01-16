import { prisma } from "@/lib/prisma";

export async function getHomeStats(userId: string, role: "MANAGER" | "EMPLOYEE") {
  if (role === "MANAGER") {
    const users = await prisma.user.findMany({
      where: { role: "EMPLOYEE" },
      include: { tasks: true },
    });

    let totalTasks = 0;
    let activeTasks = 0;
    let completedTasks = 0;

    users.forEach(user => {
      totalTasks += user.tasks.length;
      completedTasks += user.tasks.filter(t => t.status === "DONE").length;
      activeTasks += user.tasks.filter(t => t.status !== "DONE").length;
    });

    return {
      totalTasks,
      activeTasks,
      completedTasks,
      teamMembers: users.length,
    };
  } else {
    const tasks = await prisma.task.findMany({
      where: { userId },
    });

    const completed = tasks.filter(t => t.status === "DONE").length;
    const active = tasks.filter(t => t.status !== "DONE").length;

    return {
      activeTasks: active,
      completedTasks: completed,
      totalTasks: tasks.length,
    };
  }
}

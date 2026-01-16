import {prisma }from "@/lib/prisma";

export async function getEmployeeDashboardData(userId: string) {
  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const completed = tasks.filter(t => t.status === "DONE");
  const inProgress = tasks.filter(t => t.status === "IN_PROGRESS");
  const todo = tasks.filter(t => t.status === "TODO");

  return {
    stats: {
      active: inProgress.length + todo.length,
      inProgress: inProgress.length,
      completed: completed.length,
      completionRate: tasks.length
        ? Math.round((completed.length / tasks.length) * 100)
        : 0,
    },
    recentTasks: tasks.slice(0, 3),
  };
}

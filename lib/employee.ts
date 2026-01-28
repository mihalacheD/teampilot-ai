import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@/lib/constants/task-status";

export type EmployeeDashboardData = {
  stats: {
    active: number;
    inProgress: number;
    completed: number;
    completionRate: number;
  };
  recentTasks: {
    id: string;
    title: string;
    status: TaskStatus;
  }[];
};

export async function getEmployeeDashboardData(
  userId: string
): Promise<EmployeeDashboardData> {
  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const completed = tasks.filter((t) => t.status === "DONE");
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS");
  const todo = tasks.filter((t) => t.status === "TODO");

  return {
    stats: {
      active: inProgress.length + todo.length,
      inProgress: inProgress.length,
      completed: completed.length,
      completionRate: tasks.length
        ? Math.round((completed.length / tasks.length) * 100)
        : 0,
    },
    recentTasks: tasks.slice(0, 3).map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status as TaskStatus,
    })),
  };
}
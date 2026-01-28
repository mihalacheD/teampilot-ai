import { prisma } from "@/lib/prisma";

export type ManagerDashboardData = {
  stats: {
    totalTasks: number;
    activeTasks: number;
    teamMembers: number;
    completionRate: number;
  };
  tasksByUser: {
    id: string;
    name: string;
    taskCount: number;
  }[];
  metrics: {
    todo: number;
    inProgress: number;
    done: number;
  };
};

export async function getManagerDashboardData(): Promise<ManagerDashboardData> {
  const users = await prisma.user.findMany({
    where: { role: "EMPLOYEE" },
    include: { tasks: true },
  });

  const allTasks = users.flatMap((u) => u.tasks);
  const completed = allTasks.filter((t) => t.status === "DONE");
  const inProgress = allTasks.filter((t) => t.status === "IN_PROGRESS");
  const todo = allTasks.filter((t) => t.status === "TODO");

  return {
    stats: {
      totalTasks: allTasks.length,
      activeTasks: inProgress.length + todo.length,
      teamMembers: users.length,
      completionRate: allTasks.length
        ? Math.round((completed.length / allTasks.length) * 100)
        : 0,
    },
    tasksByUser: users.map((user) => ({
      id: user.id,
      name: user.name,
      taskCount: user.tasks.length,
    })),
    metrics: {
      todo: todo.length,
      inProgress: inProgress.length,
      done: completed.length,
    },
  };
}

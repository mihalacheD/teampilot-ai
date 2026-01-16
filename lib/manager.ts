import { prisma } from "@/lib/prisma";

export async function getManagerDashboardData() {
  const users = await prisma.user.findMany({
    where: {
      role: "EMPLOYEE"
    },
    include: {
      tasks: true
    }
  });

  const allTasks = users.flatMap(u => u.tasks);

  const completed = allTasks.filter(t => t.status === "DONE");
  const inProgress = allTasks.filter(t => t.status === "IN_PROGRESS");
  const todo = allTasks.filter(t => t.status === "TODO");

  return {
    stats: {
      totalTasks: allTasks.length,
      activeTasks: inProgress.length + todo.length,
      teamMembers: users.length,
      completionRate: allTasks.length
        ? Math.round((completed.length / allTasks.length) * 100)
        : 0
    },

    tasksByUser: users.map(user => ({
      id: user.id,
      name: user.name,
      taskCount: user.tasks.length
    })),

    metrics: {
      todo: todo.length,
      inProgress: inProgress.length,
      done: completed.length
    }
  };
}

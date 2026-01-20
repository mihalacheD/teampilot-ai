import { prisma } from "@/lib/prisma";
import { Task } from "@prisma/client";

function calculateWorkload(tasks: Task[]) {
  const now = new Date();
  const activeTasks = tasks.filter((t) => t.status !== "DONE");
  const overdueTasks = activeTasks.filter((t) => t.dueDate && t.dueDate < now);
  const score = activeTasks.length * 2 + overdueTasks.length * 3;
  return {
    activeTasks: activeTasks.length,
    overdueTasks: overdueTasks.length,
    score,
  };
}

export async function getTeamOverview() {
  const members = await prisma.user.findMany({
    where: { role: "EMPLOYEE" },
    include: { tasks: true },
  });
  return members.map((member) => {
    const workload = calculateWorkload(member.tasks);
    return {
      id: member.id,
      name: member.name,
      email: member.email,
      totalTasks: member.tasks.length,
      completedTasks: member.tasks.filter((t) => t.status === "DONE").length,
      activeTasks: workload.activeTasks,
      workload,
    };
  });
}

export async function getTeamMember(id: string) {
  const member = await prisma.user.findUnique({
    where: { id },
    include: {
      tasks: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!member) return null;
  const workload = calculateWorkload(member.tasks);
  return {
    id: member.id,
    name: member.name,
    email: member.email,
    totalTasks: member.tasks.length,
    completedTasks: member.tasks.filter((t) => t.status === "DONE").length,
    activeTasks: workload.activeTasks,
    tasks: member.tasks,
    workload,
  };
}
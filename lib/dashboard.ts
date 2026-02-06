import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@/lib/constants/task-status";
import { Priority } from "@/lib/constants/priority";

/* ---------- Helpers ---------- */

function isActive(status: TaskStatus) {
  return status !== "DONE";
}

function isUrgent(task: { status: TaskStatus; priority: Priority }) {
  return (
    task.status !== "DONE" &&
    (task.priority === "HIGH" || task.priority === "URGENT")
  );
}

function isOverdue(task: {
  status: TaskStatus;
  dueDate: Date | null;
}) {
  return (
    task.status !== "DONE" &&
    task.dueDate !== null &&
    task.dueDate < new Date()
  );
}


/* ---------- Types ---------- */

export type DashboardStats = {
  total?: number;
  active: number;
  inProgress: number;
  completed: number;
  urgent: number;
  overdue: number;
  completionRate: number;
};


export type EmployeeDashboardData = {
  stats: DashboardStats;
  recentTasks: {
    id: string;
    title: string;
    status: TaskStatus;
  }[];
};

export async function getEmployeeDashboardData(
  userId: string,
): Promise<EmployeeDashboardData> {
  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const completed = tasks.filter((t) => t.status === "DONE");
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS");
  const urgent = tasks.filter(isUrgent);
  const overdue = tasks.filter(isOverdue);

  return {
    stats: {
      active: tasks.filter((t) => isActive(t.status)).length,
      inProgress: inProgress.length,
      completed: completed.length,
      urgent: urgent.length,
      overdue: overdue.length,
      completionRate: tasks.length
        ? Math.round((completed.length / tasks.length) * 100)
        : 0,
    },
    recentTasks: tasks.slice(0, 3).map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
    })),
  };
}


export type ManagerDashboardData = {
  stats: {
    totalTasks: number;
    activeTasks: number;
    completedTasks: number;
    urgent: number;
    overdue: number;
    completionRate: number;
    teamMembers: number;
  };
  metrics: {
    todo: number;
    inProgress: number;
    done: number;
  };
  tasksByUser: {
    id: string;
    name: string;
    taskCount: number;
  }[];
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
  const urgent = allTasks.filter(isUrgent);
  const overdue = allTasks.filter(isOverdue);

  return {
    stats: {
      totalTasks: allTasks.length,
      activeTasks: inProgress.length + todo.length,
      completedTasks: completed.length,
      urgent: urgent.length,
      overdue: overdue.length,
      completionRate: allTasks.length
        ? Math.round((completed.length / allTasks.length) * 100)
        : 0,
      teamMembers: users.length,
    },
    tasksByUser: users.map((u) => ({
      id: u.id,
      name: u.name ?? "Unknown",
      taskCount: u.tasks.length,
    })),
    metrics: {
      todo: todo.length,
      inProgress: inProgress.length,
      done: completed.length,
    },
  };
}

export async function getHomeStats(
  userId: string,
  role: "MANAGER" | "EMPLOYEE",
) {
  if (role === "MANAGER") {
    const data = await getManagerDashboardData();

    return {
      totalTasks: data.stats.totalTasks,
      activeTasks: data.stats.activeTasks,
      completedTasks: data.stats.completedTasks,
      urgentTasks: data.stats.urgent,
      overdueTasks: data.stats.overdue,
      teamMembers: data.stats.teamMembers,
      completitionRate: data.stats.completionRate,
    };
  }

  const data = await getEmployeeDashboardData(userId);

  return {
    totalTasks: data.stats.active + data.stats.completed,
    activeTasks: data.stats.active,
    inProgressTasks: data.stats.inProgress,
    completedTasks: data.stats.completed,
    urgentTasks: data.stats.urgent,
    overdueTasks: data.stats.overdue,
  };
}


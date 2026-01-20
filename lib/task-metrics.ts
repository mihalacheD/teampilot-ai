import { TaskStatus } from "./constants/task-status";


export const statusLabels: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export function calculatePercentage(value: number, total: number) {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}


export function calculateTaskStats(tasks: { status: TaskStatus }[]) {
  const total = tasks.length;

  const todo = tasks.filter(t => t.status === "TODO").length;
  const inProgress = tasks.filter(t => t.status === "IN_PROGRESS").length;
  const done = tasks.filter(t => t.status === "DONE").length;

  return {
    total,
    todo,
    inProgress,
    done,
    todoPct: calculatePercentage(todo, total),
    inProgressPct: calculatePercentage(inProgress, total),
    donePct: calculatePercentage(done, total),
    completionRate: calculatePercentage(done, total),
  };
}

export function calculateMetricsPercentages(
  metrics: { todo: number; inProgress: number; done: number },
  total: number
) {
  return {
    todoPct: total ? Math.round((metrics.todo / total) * 100) : 0,
    inProgressPct: total ? Math.round((metrics.inProgress / total) * 100) : 0,
    donePct: total ? Math.round((metrics.done / total) * 100) : 0,
  };
}


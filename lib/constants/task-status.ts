export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const statusStyles: Record<TaskStatus, string> = {
  TODO: "bg-orange-50 text-orange-800 font-medium",
  IN_PROGRESS: "bg-violet-50 text-violet-800 font-medium",
  DONE: "bg-green-50 text-green-800 font-medium",
};

export const statusBarStyles: Record<TaskStatus, string> = {
  TODO: "from-orange-500 to-orange-400",
  IN_PROGRESS: "from-violet-500 to-purple-500",
  DONE: "from-green-500 to-emerald-500",
};

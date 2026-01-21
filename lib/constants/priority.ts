export const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const priorityStyles: Record<Priority, string> = {
  LOW: "bg-gray-100 text-gray-800 border-gray-300",
  MEDIUM: "bg-blue-100 text-blue-800 border-blue-300",
  HIGH: "bg-orange-100 text-orange-800 border-orange-400",
  URGENT:"bg-red-600 text-white border-red-700 animate-pulse",
};

export const priorityLabels: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

export const priorityIcons: Record<Priority, string> = {
  LOW: "↓",
  MEDIUM: "→",
  HIGH: "↑",
  URGENT: "⚠",
};
import { Task } from "@/lib/api/tasks";
import { SortOption } from "@/components/task/Sortdropdown";

const PRIORITY_ORDER = {
  URGENT: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

const STATUS_ORDER = {
  TODO: 1,
  IN_PROGRESS: 2,
  DONE: 3,
};

export function sortTasks(tasks: Task[], sortBy: SortOption): Task[] {
  const sorted = [...tasks];

  switch (sortBy) {
    case "priority-desc":
      return sorted.sort((a, b) => {
        return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
      });

    case "priority-asc":
      return sorted.sort((a, b) => {
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      });

    case "dueDate-asc":
      return sorted.sort((a, b) => {
        // Tasks without due date go to the end
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });

    case "dueDate-desc":
      return sorted.sort((a, b) => {
        // Tasks without due date go to the end
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      });

    case "status-asc":
      return sorted.sort((a, b) => {
        return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      });

    default:
      return sorted;
  }
}
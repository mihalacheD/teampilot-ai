"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FolderOpen } from "lucide-react";
import { useTasks } from "@/hooks/useTask";
import { Priority, PRIORITIES } from "@/lib/constants/priority";
import { SortOption } from "./Sortdropdown";
import { sortTasks } from "@/lib/sort";
import TaskForm from "./TaskForm";
import { FilterSortBar } from "./FilterSortBar";
import { DashboardEmptyState, DashboardError, DashboardLoading } from "../dashboard/DasboardStates";
import { TaskItem } from "./TaskItem";

export function TaskList() {
  const {
    tasks,
    updatingTaskId,
    createTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
    isLoading,
    error
  } = useTasks();

  const router = useRouter();
  const searchParams = useSearchParams();

  // Logică filtru - păstrează sync cu URL
  const param = searchParams.get("priority");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "ALL">(
    param && PRIORITIES.includes(param as Priority) ? (param as Priority) : "ALL"
  );

  // Logică sort - local state (opțional: poate fi și în URL)
  const [sortBy, setSortBy] = useState<SortOption>("priority-desc");

  const handleFilterChange = (value: Priority | "ALL") => {
    setPriorityFilter(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL") {
      params.delete("priority");
    } else {
      params.set("priority", value);
    }
    router.replace(`?${params.toString()}`);
  };

  // Apply filter and sort cu useMemo pentru performance
  const processedTasks = useMemo(() => {
    // Step 1: Filter by priority
    let filtered = tasks;
    if (priorityFilter !== "ALL") {
      filtered = tasks.filter((t) => t.priority === priorityFilter);
    }

    // Step 2: Sort
    return sortTasks(filtered, sortBy);
  }, [tasks, priorityFilter, sortBy]);

  if (isLoading) return <DashboardLoading />;
  if (error) return <DashboardError message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="space-y-6">
      <TaskForm onCreate={createTask} />

      <FilterSortBar
        priorityFilter={priorityFilter}
        onPriorityChange={handleFilterChange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        taskCount={processedTasks.length}
      />

      {processedTasks.length === 0 ? (
        <DashboardEmptyState
          icon={<FolderOpen className="w-8 h-8 text-gray-400" />}
          title="No tasks found"
          description={
            priorityFilter === "ALL"
              ? "Get started by creating your first task above."
              : `You don't have any tasks marked as ${priorityFilter.toLowerCase()} priority.`
          }
        />
      ) : (
        <ul className="space-y-3">
          {processedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isLoading={updatingTaskId === task.id}
              onStatusChange={updateTaskStatus}
              onEdit={(id, updates) => updateTask(id, updates)}
              onDelete={deleteTask}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
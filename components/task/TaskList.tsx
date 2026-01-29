"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FolderOpen } from "lucide-react";

import { useTasks } from "@/hooks/useTask";
import { Priority, PRIORITIES } from "@/lib/constants/priority";

import TaskForm from "./TaskForm";
import { PriorityFilter } from "./PriorityFilter";
import { DashboardEmptyState, DashboardError, DashboardLoading } from "../dashboard/DasboardStates";
import { TaskItem } from "./TaskItem";


export function TaskList() {
  const { tasks, updatingTaskId, createTask, updateTaskStatus, updateTask, deleteTask, isLoading, error } = useTasks();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Logică filtru
  const param = searchParams.get("priority");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "ALL">(
    param && PRIORITIES.includes(param as Priority) ? (param as Priority) : "ALL"
  );

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

  const filteredTasks = priorityFilter === "ALL"
    ? tasks
    : tasks.filter((t) => t.priority === priorityFilter);

  if (isLoading) return <DashboardLoading />;
  if (error) return <DashboardError message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="space-y-6">
      <TaskForm onCreate={createTask} />

      <PriorityFilter current={priorityFilter} onChange={handleFilterChange} />

      {filteredTasks.length === 0 ? (
        <DashboardEmptyState
          icon={<FolderOpen className="w-8 h-8 text-gray-400" />}
          title="No tasks found"
          description={priorityFilter === "ALL"
            ? "Get started by creating your first task above."
            : `You don't have any tasks marked as ${priorityFilter.toLowerCase()} priority.`
          }
        />
      ) : (
        <ul className="space-y-3">
          {filteredTasks.map((task) => (
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
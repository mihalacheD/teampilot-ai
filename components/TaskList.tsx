"use client";

import { TaskItem } from "@/components/TaskItem";
import { useTasks } from "@/hooks/useTask";
import TaskForm from "./TaskForm";

export function TaskList() {
  const { tasks, updatingTaskId, createTask, updateTaskStatus, updateTaskTitle, deleteTask } = useTasks();

  return (
    <div>
      <TaskForm onCreate={createTask} />

      <ul className="space-y-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isLoading={updatingTaskId === task.id}
            onStatusChange={updateTaskStatus}
            onEdit={updateTaskTitle}
            onDelete={deleteTask}
          />
        ))}
      </ul>
    </div >
  );
}


"use client";

import { TaskItem } from "@/components/TaskItem";
import { useTasks } from "@/hooks/useTask";
import TaskForm from "./TaskForm";

export function TaskList() {
  const { tasks, updatingTaskId, createTask, updateTaskStatus, updateTask, deleteTask } = useTasks();

  const handleEdit = (id: string, updates: { title: string; description: string }) => {
    updateTask(id, updates);
  };

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
            onEdit={handleEdit}
            onDelete={deleteTask}
          />
        ))}
      </ul>
    </div >
  );
}


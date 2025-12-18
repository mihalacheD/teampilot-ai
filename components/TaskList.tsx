"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema, CreateTaskInput } from "@/lib/validators/task";

type Task = {
  id: string;
  title: string;
  status: string;
};

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
  });

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then(setTasks);
  }, []);

  async function onSubmit(data: CreateTaskInput) {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const newTask = await res.json();
      setTasks((prev) => [newTask, ...prev]);
      reset();
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 mb-4">
        <input
          {...register("title")}
          placeholder="Task title"
          className="border p-2 w-full"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}

        <input
          {...register("userId")}
          placeholder="User ID"
          className="border p-2 w-full"
        />

        <button className="bg-black text-white px-4 py-2">
          Add task
        </button>
      </form>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="border p-2 flex justify-between">
            <span>{task.title}</span>
            <span className="text-sm text-gray-500">{task.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}


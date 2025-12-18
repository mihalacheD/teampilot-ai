"use client";

import { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: string;
};

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then(setTasks);
  }, []);

  async function createTask() {
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        userId: "1",
      }),
    });

    setTitle("");
  }

  return (
    <div>
      <input
        className="border p-2 mr-2"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        className="bg-black text-white px-3 py-2"
        onClick={createTask}
      >
        Add
      </button>

      <ul className="mt-4 space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="border p-2">
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

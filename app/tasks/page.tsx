import { TaskList } from "@/components/task/TaskList";
import { Suspense } from "react";

export default function TasksPage() {
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        Tasks
      </h1>
      <Suspense fallback={<p>Loading tasks...</p>}>
        <TaskList />
      </Suspense>
    </>
  );
}


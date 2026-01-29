import { TaskList } from "../../components/task/TaskList";

export default function TasksPage() {
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        Tasks
      </h1>
      <TaskList />
    </>
  );
}


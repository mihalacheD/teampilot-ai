import { TaskList } from "../../components/TaskList";

export default function TasksPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Tasks</h1>
      <TaskList />
    </main>
  );
}

import { TaskList } from "../../components/TaskList";

export default function TasksPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Tasks
          </h1>
        </div>
        <TaskList />
      </div>
    </div>
  );
}

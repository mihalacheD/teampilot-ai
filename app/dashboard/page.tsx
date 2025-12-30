"use client";

import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) return null;

  const isManager = session.user.role === "MANAGER";

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">
        {isManager ? "Manager Dashboard" : "My Dashboard"}
      </h1>

      {isManager ? <ManagerDashboard /> : <EmployeeDashboard />}
    </section>
  );
}

function EmployeeDashboard() {
  return (
    <>
      <p className="text-gray-600">
        Overview of your assigned tasks and progress.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card title="My Tasks">
          View and update your current tasks.
        </Card>

        <Card title="Progress">
          Track completed vs pending work.
        </Card>
      </div>
    </>
  );
}
function ManagerDashboard() {
  return (
    <>
      <p className="text-gray-600">
        Overview of team tasks, performance and AI insights.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title="Team Tasks">
          View tasks across all employees.
        </Card>

        <Card title="Metrics">
          Completion rates & workload.
        </Card>

        <Card title="AI Summary">
          Daily team insights powered by AI.
        </Card>
      </div>
    </>
  );
}
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded p-4 bg-white">
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{children}</p>
    </div>
  );
}

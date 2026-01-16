import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ManagerDashboard from "@/components/ManagerDashboard";
import EmployeeDashboard from "@/components/EmployeeDashboard";
import { getManagerDashboardData } from "@/lib/manager";
import { getEmployeeDashboardData } from "@/lib/employee";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const isManager = session.user.role === "MANAGER";

  if (isManager) {
    const data = await getManagerDashboardData();

    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Header isManager />
          <ManagerDashboard data={data} />
        </div>
      </div>
    );
  }


  if (!isManager) {
    const data = await getEmployeeDashboardData(session.user.id);

    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Header isManager={false} />
          <EmployeeDashboard data={data} />
        </div>
      </div>
    );
  }
}

function Header({ isManager }: { isManager: boolean }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        {isManager ? "Manager Dashboard" : "My Dashboard"}
      </h1>
      <p className="text-gray-600">
        {isManager
          ? "Overview of team tasks and performance"
          : "Overview of your assigned tasks and progress"}
      </p>
    </div>
  );
}

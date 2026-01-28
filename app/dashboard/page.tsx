import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ManagerDashboard from "@/components/dashboard/ManagerDashboard";
import EmployeeDashboard from "@/components/dashboard/EmployeeDashboard";
import { getManagerDashboardData } from "@/lib/manager";
import { getEmployeeDashboardData } from "@/lib/employee";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";


export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session){ redirect("/api/auth/signin")};

  const isManager = session.user.role === "MANAGER";

  return (
    <>
      {isManager ? (
        <>
          <DashboardHeader
            title="Manager Dashboard"
            subtitle="Overview of team tasks and performance"
          />
          <ManagerDashboard data={await getManagerDashboardData()} />
        </>
      ) : (
        <>
          <DashboardHeader
            title="My Dashboard"
            subtitle="Overview of your assigned tasks and progress"
          />
          <EmployeeDashboard data={await getEmployeeDashboardData(session.user.id)} />
        </>
      )}
    </>
  );
}
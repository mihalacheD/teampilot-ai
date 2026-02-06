import {
  CheckCircle2,
  BarChart3,
  Users,
  Sparkles,
  Zap,
  AlertTriangle,
  Clock,
  TrendingUp,
} from "lucide-react";
import LandingPage from "@/components/LandingPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import StatCard from "@/components/ui/StatCard";
import { RoleBadge } from "@/components/home/RoleBadge";
import { QuickActionCard } from "@/components/home/QuickActionCard";
import { getHomeStats } from "@/lib/dashboard";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <LandingPage />;
  }

  const stats = await getHomeStats(session.user.id, session.user.role);
  const isManager = session.user.role === "MANAGER";


  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          {/* Header */}
          <header className="flex items-center gap-5 mb-10">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">
                Welcome, {session.user.name?.split(" ")[0]}!
              </h1>
              <p className="text-gray-500 font-medium">
                {isManager
                  ? "Team performance overview"
                  : "Your daily task focus"}
              </p>
            </div>
          </header>

          {/* Stats */}
          {isManager ? (
            /* ================= MANAGER ================= */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-5 mb-10">
              <StatCard
                title="Total Tasks"
                value={stats.totalTasks}
                color="blue"
                icon={<CheckCircle2 />}
                subtitle="Across the team"
              />

              <StatCard
                title="Active Tasks"
                value={stats.activeTasks}
                color="purple"
                icon={<Clock />}
                subtitle="In progress & todo"
              />

              <StatCard
                title="Overdue"
                value={stats.overdueTasks}
                color="red"
                icon={<AlertTriangle />}
                subtitle="Needs attention"
              />

              <StatCard
                title="Urgent Tasks"
                value={stats.urgentTasks}
                color="orange"
                icon={<AlertTriangle />}
                subtitle="Needs attention"
              />

              <StatCard
                title="Completion"
                value={`${stats.completitionRate}%`}
                color="green"
                icon={<TrendingUp />}
                subtitle="Overall efficiency"
              />

              <StatCard
                title="Team Members"
                value={stats.teamMembers ?? 0}
                color="yellow"
                icon={<Users />}
                subtitle="Active employees"
              />
            </div>
          ) : (
            /* ================= EMPLOYEE ================= */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              <StatCard
                title="Active Tasks"
                value={stats.activeTasks}
                color="blue"
                icon={<CheckCircle2 />}
                subtitle="Assigned to you"
              />

              <StatCard
                title="Urgent Tasks"
                value={stats.urgentTasks}
                color="red"
                icon={<AlertTriangle />}
                subtitle="Needs attention"
              />

              <StatCard
                title="In Progress"
                value={stats.inProgressTasks ?? 0}
                color="purple"
                icon={<Clock />}
                subtitle="Currently working on"
              />

              <StatCard
                title="Completed"
                value={stats.completedTasks}
                color="green"
                icon={<Zap />}
                subtitle="All time"
              />
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Quick Navigation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isManager && (
                <QuickActionCard
                  href="/dashboard"
                  variant="primary"
                  icon={<BarChart3 />}
                  title="Manager Dashboard"
                  description="Analytics & workload insights"
                />
              )}

              <QuickActionCard
                href="/tasks"
                icon={<CheckCircle2 />}
                title={isManager ? "All Tasks" : "My Tasks"}
                description="Manage status and deadlines"
              />
            </div>
          </div>

          <RoleBadge role={session.user.role} />
        </div>
      </div>
    </div>
  );
}

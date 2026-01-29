import { CheckCircle2, BarChart3, Users, Sparkles, Zap } from "lucide-react";
import { getHomeStats } from "@/lib/home";
import LandingPage from "@/components/LandingPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import StatCard from "@/components/ui/StatCard";
import { RoleBadge } from "@/components/home/RoleBadge";
import { QuickActionCard } from "@/components/home/QuickActionCard";

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
                {isManager ? "Team performance overview" : "Your daily task summary"}
              </p>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            <StatCard
              title="Active Tasks" value={stats.activeTasks} color="blue"
              icon={<CheckCircle2 />} subtitle={isManager ? "Global count" : "Personal tasks"}
            />
            <StatCard
              title="Completed" value={stats.completedTasks} color="green"
              icon={<Zap />} subtitle="All time"
            />
            {isManager && (
              <StatCard
                title="Team Members" value={stats.teamMembers ?? 0} color="purple"
                icon={<Users />} subtitle="Collaborators"
              />
            )}
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Quick Navigation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isManager && (
                <QuickActionCard
                  href="/dashboard" variant="primary" icon={<BarChart3 />}
                  title="Manager Dashboard" description="Deep dive into analytics"
                />
              )}
              <QuickActionCard
                href="/tasks" icon={<CheckCircle2 />}
                title={isManager ? "Workload Table" : "My Task List"} description="Manage status and deadlines"
              />
            </div>
          </div>

          <RoleBadge role={session.user.role} />
        </div>
      </div>
    </div>
  )
}
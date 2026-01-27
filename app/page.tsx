

import Link from "next/link";
import { CheckCircle2, BarChart3, Users, Sparkles, ArrowRight, Zap } from "lucide-react";
import { getHomeStats } from "@/lib/home";
import LandingPage from "@/components/LandingPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import StatCard from "@/components/StatCard";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <LandingPage />;
  }

  const stats = await getHomeStats(session.user.id, session.user.role as "MANAGER" | "EMPLOYEE");


  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          {/* Header */}
          <div className="flex items-center gap-3 md:gap-6 mb-8">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 md:w-6 h-5 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
                Welcome back, {session.user.name?.split(" ")[0] || "there"}! 👋
              </h1>
              <p className="text-gray-500 mt-1">
                {session.user.role === "MANAGER"
                  ? "Let's see how your team is performing today"
                  : "Ready to tackle your tasks for today"}
              </p>
            </div>
          </div>


          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard
              title="Active Tasks"
              value={stats.activeTasks}
              subtitle={session.user.role === "MANAGER" ? "All active tasks" : "Assigned to you"}
              icon={<CheckCircle2 className="w-5 h-5" />}
              color="blue"
            />

            <StatCard
              title="Completed"
              value={stats.completedTasks}
              subtitle="All time"
              icon={<Zap className="w-5 h-5" />}
              color="green"
            />

            {session.user.role === "MANAGER" && (
              <StatCard
                title="Team Members"
                value={stats.teamMembers ?? 0}
                subtitle="All active"
                icon={<Users className="w-5 h-5" />}
                color="purple"
              />
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Quick Actions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {session.user.role === "MANAGER" && (
                <Link
                  href="/dashboard"
                  className="group flex items-center justify-between p-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5" />
                    <div>
                      <p className="font-semibold">Team Dashboard</p>
                      <p className="text-xs text-blue-100">View analytics & insights</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}

              <Link
                href="/tasks"
                className="group flex items-center justify-between p-4 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 rounded-xl transition-all"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gray-700" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {session.user.role === "MANAGER" ? "All Tasks" : "My Tasks"}
                    </p>
                    <p className="text-xs text-gray-500">Manage your work</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Role Badge */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Logged in as <span className="font-semibold">{session.user.role}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

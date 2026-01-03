"use client";

import { useSession } from "next-auth/react";
import {
  CheckCircle2,
  TrendingUp,
  Users,
  Sparkles,
  Clock,
  BarChart3,
  Target,
  Zap,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import DashboardCard from "@/components/DashboardCard";
import TeamTaskPreview from "@/components/TeamTaskPreview";
import MetricBar from "@/components/MetricBar";
import StatCard from "@/components/StatCard";
import TaskPreview from "@/components/TaskPreview";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  if (!session) return null;

  const isManager = session.user.role === "MANAGER";

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {isManager ? "Manager Dashboard" : "My Dashboard"}
          </h1>
          <p className="text-gray-600">
            {isManager
              ? "Overview of team tasks, performance and AI insights"
              : "Overview of your assigned tasks and progress"}
          </p>
        </div>

        {isManager ? <ManagerDashboard /> : <EmployeeDashboard />}
      </div>
    </div>
  );
}

function EmployeeDashboard() {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<CheckCircle2 className="w-6 h-6" />}
          title="Active Tasks"
          value="8"
          subtitle="3 due this week"
          color="blue"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          title="In Progress"
          value="5"
          subtitle="Currently working on"
          color="yellow"
        />
        <StatCard
          icon={<Target className="w-6 h-6" />}
          title="Completed"
          value="24"
          subtitle="This month"
          color="green"
        />
      </div>

      {/* Main Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard
          icon={<CheckCircle2 className="w-6 h-6" />}
          title="My Tasks"
          description="View and update your current tasks"
          color="blue"
          link="/tasks"
        >
          <div className="mt-4 space-y-2">
            <TaskPreview title="Complete project documentation" status="In Progress" />
            <TaskPreview title="Review pull requests" status="To Do" />
            <TaskPreview title="Update team wiki" status="To Do" />
          </div>
        </DashboardCard>

        <DashboardCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Progress"
          description="Track completed vs pending work"
          color="green"
        >
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-semibold text-gray-900">75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-linear-to-r from-green-500 to-emerald-500 h-3 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <div className="flex justify-between mt-3 text-xs text-gray-500">
              <span>24 completed</span>
              <span>8 remaining</span>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Quick Actions */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold mb-2">Ready to be productive?</h3>
            <p className="text-blue-100">Jump straight to your task list and start making progress</p>
          </div>
          <Link
            href="/tasks"
            className="group flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-lg transition-all whitespace-nowrap"
          >
            View All Tasks
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ManagerDashboard() {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<CheckCircle2 className="w-6 h-6" />}
          title="Total Tasks"
          value="42"
          subtitle="12 active"
          color="blue"
        />
        <StatCard
          icon={<Users className="w-6 h-6" />}
          title="Team Members"
          value="5"
          subtitle="All active"
          color="purple"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Completion Rate"
          value="78%"
          subtitle="+5% from last week"
          color="green"
        />
        <StatCard
          icon={<Zap className="w-6 h-6" />}
          title="Productivity"
          value="High"
          subtitle="Above average"
          color="yellow"
        />
      </div>

      {/* Main Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard
          icon={<Users className="w-6 h-6" />}
          title="Team Tasks"
          description="View tasks across all employees"
          color="blue"
          link="/tasks"
        >
          <div className="mt-4 space-y-2">
            <TeamTaskPreview name="Alice Chen" taskCount={8} />
            <TeamTaskPreview name="Bob Smith" taskCount={6} />
            <TeamTaskPreview name="Carol Johnson" taskCount={5} />
          </div>
        </DashboardCard>

        <DashboardCard
          icon={<BarChart3 className="w-6 h-6" />}
          title="Metrics"
          description="Completion rates & workload"
          color="green"
        >
          <div className="mt-4 space-y-3">
            <MetricBar label="On Track" percentage={65} color="green" />
            <MetricBar label="At Risk" percentage={25} color="yellow" />
            <MetricBar label="Overdue" percentage={10} color="red" />
          </div>
        </DashboardCard>

        <DashboardCard
          icon={<Sparkles className="w-6 h-6" />}
          title="AI Summary"
          description="Daily team insights powered by AI"
          color="purple"
        >
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0"></div>
              <p>Team productivity is <span className="font-semibold text-gray-900">above average</span> this week</p>
            </div>
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 shrink-0"></div>
              <p>3 tasks are approaching their deadline</p>
            </div>
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
              <p>Alice has the highest completion rate this month</p>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* AI Insights Banner */}
      <div className="bg-linear-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">AI-Powered Insights</h3>
            <p className="text-purple-100 mb-4">
              Get intelligent recommendations to optimize team performance and identify potential bottlenecks before they become issues.
            </p>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg font-medium transition-all">
              View Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
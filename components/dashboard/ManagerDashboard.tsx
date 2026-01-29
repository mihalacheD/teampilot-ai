
"use client";

import {
  CheckCircle2,
  TrendingUp,
  Users,
  Sparkles,
  BarChart3,
  Zap,
  UserCircle,
} from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import MetricBar from "@/components/ui/MetricBar";
import StatCard from "@/components/ui/StatCard";
import { calculateMetricsPercentages } from "@/lib/task-metrics";
import DashboardBanner from "./DashboardBanner";
import { ManagerDashboardData } from "@/lib/manager";
import TeamTaskPreview from "./TeamTaskPreview";

type ManagerDashboardProps = {
  data: ManagerDashboardData;
};

export default function ManagerDashboard({ data }: ManagerDashboardProps) {
  const percentages = calculateMetricsPercentages(
    data.metrics,
    data.stats.totalTasks
  );

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<CheckCircle2 className="w-6 h-6" />}
          title="Total Tasks"
          value={data.stats.totalTasks.toString()}
          subtitle={`${data.stats.activeTasks} active`}
          color="blue"
        />
        <StatCard
          icon={<Users className="w-6 h-6" />}
          title="Team Members"
          value={data.stats.teamMembers.toString()}
          subtitle="All active"
          color="purple"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Completion Rate"
          value={`${data.stats.completionRate}%`}
          subtitle="Overall progress"
          color="green"
        />
        <StatCard
          icon={<Zap className="w-6 h-6" />}
          title="Productivity"
          value={`${data.stats.completionRate}%`}
          subtitle="Tasks completed"
          color="yellow"
        />
      </div>

      {/* Team Tasks */}
      <DashboardCard
        icon={<Users className="w-6 h-6" />}
        title="Team Tasks"
        description="View tasks across all employees"
        color="blue"
        link="/tasks"
      >
        <div className="mt-4 space-y-2">
          {data.tasksByUser.length > 0 ? (
            data.tasksByUser.map((user) => (
              <TeamTaskPreview
                key={user.id}
                name={user.name}
                taskCount={user.taskCount}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <UserCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No team members yet</p>
            </div>
          )}
        </div>
      </DashboardCard>

      {/* Metrics */}
      <DashboardCard
        icon={<BarChart3 className="w-6 h-6" />}
        title="Task Metrics"
        description="Completion rates & workload distribution"
        color="green"
      >
        <div className="space-y-3">
          <MetricBar
            label="To Do"
            percentage={percentages.todoPct}
            status="TODO"
          />
          <MetricBar
            label="In Progress"
            percentage={percentages.inProgressPct}
            status="IN_PROGRESS"
          />
          <MetricBar
            label="Done"
            percentage={percentages.donePct}
            status="DONE"
          />
        </div>
      </DashboardCard>

      {/* AI Insights Banner */}
      <DashboardBanner
        icon={Sparkles}
        title="AI-Powered Insights"
        description="Get intelligent recommendations to optimize team performance"
        buttonText="View Full Report"
        buttonHref="/assistant"
        variant="purple"
      />
    </div>
  );
}

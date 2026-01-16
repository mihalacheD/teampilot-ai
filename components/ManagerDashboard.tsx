"use client";

import {
  CheckCircle2,
  TrendingUp,
  Users,
  Sparkles,
  BarChart3,
  Zap,
} from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import TeamTaskPreview from "@/components/TeamTaskPreview";
import MetricBar from "@/components/MetricBar";
import StatCard from "@/components/StatCard";

type Props = {
  data: {
    stats: {
      totalTasks: number;
      activeTasks: number;
      teamMembers: number;
      completionRate: number;
    };
    tasksByUser: {
      id: string;
      name: string;
      taskCount: number;
    }[];
    metrics: {
      todo: number;
      inProgress: number;
      done: number;
    };
  };
};

export default function ManagerDashboard({ data }: Props) {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          subtitle="Overall"
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
          {data.tasksByUser.map(user => (
            <TeamTaskPreview
              key={user.id}
              name={user.name}
              taskCount={user.taskCount}
            />
          ))}
        </div>
      </DashboardCard>

      {/* Metrics */}
      <DashboardCard
        icon={<BarChart3 className="w-6 h-6" />}
        title="Metrics"
        description="Completion rates & workload"
        color="green"
      >

        <MetricBar
          label="To Do"
          percentage={Math.round(
            (data.metrics.todo / data.stats.totalTasks) * 100
          )}
          color="red"
        />
        <MetricBar
          label="In Progress"
          percentage={Math.round(
            (data.metrics.inProgress / data.stats.totalTasks) * 100
          )}
          color="yellow"
        />
        <MetricBar
          label="Done"
          percentage={Math.round(
            (data.metrics.done / data.stats.totalTasks) * 100
          )}
          color="green"
        />
      </DashboardCard>

      {/* AI Insights Banner IN PROGRESS*/}
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
"use client";

import {
  CheckCircle2,
  TrendingUp,
  Clock,
  Target,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import DashboardCard from "@/components/DashboardCard";
import StatCard from "@/components/StatCard";
import TaskPreview from "@/components/TaskPreview";
import { TaskStatus } from "@/lib/constants/task-status";

type Props = {
  data: {
    stats: {
      active: number;
      inProgress: number;
      completed: number;
      completionRate: number;
    };
    recentTasks: {
      id: string;
      title: string;
      status: TaskStatus;
    }[];
  };
};

export default function EmployeeDashboard({ data }: Props) {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<CheckCircle2 className="w-6 h-6" />}
          title="Active Tasks"
          value={data.stats.active.toString()}
          subtitle="Assigned to you"
          color="blue"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          title="In Progress"
          value={data.stats.inProgress.toString()}
          subtitle="Currently working on"
          color="purple"
        />
        <StatCard
          icon={<Target className="w-6 h-6" />}
          title="Completed"
          value={data.stats.completed.toString()}
          subtitle="All time"
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
            {data.recentTasks.map(task => (
              <TaskPreview
                key={task.id}
                title={task.title}
                status={task.status}
              />
            ))}
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
              <span className="font-semibold text-gray-900">
                {data.stats.completionRate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-linear-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                style={{ width: `${data.stats.completionRate}%` }}
              />
            </div>
            <div className="flex justify-between mt-3 text-xs text-gray-500">
              <span>{data.stats.completed} completed</span>
              <span>{data.stats.active} remaining</span>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Quick Actions (AI stays visually) */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold mb-2">Ready to be productive?</h3>
            <p className="text-blue-100">
              Jump straight to your task list and start making progress
            </p>
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

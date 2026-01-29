"use client";

import {
  CheckCircle2,
  TrendingUp,
  Clock,
  Target,
  ArrowRight,
} from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import StatCard from "@/components/StatCard";
import TaskPreview from "@/components/task/TaskPreview";
import { TaskStatus } from "@/lib/constants/task-status";
import DashboardBanner from "./DashboardBanner";

type EmployeeDashboardProps = {
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

export default function EmployeeDashboard({ data }: EmployeeDashboardProps) {
  const { stats, recentTasks } = data;

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<CheckCircle2 className="w-6 h-6" />}
          title="Active Tasks"
          value={stats.active.toString()}
          subtitle="Assigned to you"
          color="blue"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          title="In Progress"
          value={stats.inProgress.toString()}
          subtitle="Currently working on"
          color="purple"
        />
        <StatCard
          icon={<Target className="w-6 h-6" />}
          title="Completed"
          value={stats.completed.toString()}
          subtitle="All time"
          color="green"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Tasks Card */}
        <DashboardCard
          icon={<CheckCircle2 className="w-6 h-6" />}
          title="My Tasks"
          description="View and update your current tasks"
          color="blue"
          link="/tasks"
        >
          <div className="mt-4 space-y-2">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <TaskPreview
                  key={task.id}
                  title={task.title}
                  status={task.status}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No recent tasks</p>
              </div>
            )}
          </div>
        </DashboardCard>

        {/* Progress Card */}
        <DashboardCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Progress"
          description="Track completed vs pending work"
          color="green"
        >
          <div className="mt-4 space-y-4">
            {/* Completion Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Completion Rate</span>
                <span className="text-lg font-bold text-gray-900">
                  {stats.completionRate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-linear-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </div>

            {/* Stats Summary */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                <p className="text-xs text-gray-500 mt-1">Completed</p>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                <p className="text-xs text-gray-500 mt-1">In Progress</p>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">{stats.active}</p>
                <p className="text-xs text-gray-500 mt-1">Remaining</p>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/*Banner */}
      <DashboardBanner
        icon={ArrowRight}
        title="Ready to be productive?"
        description="Jump straight to your task list and start making progress today"
        buttonText="View All Tasks"
        buttonHref="/tasks"
        variant="purple"
      />
    </div>
  );
}
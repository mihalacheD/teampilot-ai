"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Zap,
  BarChart3,
  TrendingUp,
  Calendar,
  ArrowLeft,
  Flag
} from "lucide-react";
import { Task } from "@prisma/client";
import StatCard from "@/components/StatCard";
import DashboardCard from "@/components/DashboardCard";
import MetricBar from "@/components/MetricBar";
import { TaskStatus, statusStyles } from "@/lib/constants/task-status";
import { calculateTaskStats, statusLabels } from "@/lib/task-metrics";
import { formatDate } from "@/lib/date";
import { priorityLabels, priorityStyles } from "@/lib/constants/priority";

type Props = {
  params: Promise<{ id: string }>;
};

type MemberData = {
  id: string;
  name: string;
  email: string;
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  tasks: Task[];
  workload: {
    activeTasks: number;
    overdueTasks: number;
    score: number;
  };
};

export default function TeamMemberPage({ params }: Props) {
  const router = useRouter();
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMember() {
      try {
        const { id } = await params;
        const response = await fetch(`/api/team/${id}`);
        if (!response.ok) {
          router.push("/team");
          return;
        }
        const data = await response.json();
        setMember(data);
      } catch (error) {
        console.error("Error loading member:", error);
        router.push("/team");
      } finally {
        setLoading(false);
      }
    }
    loadMember();
  }, [params, router]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!member) return null;
  const { workload } = member;

  const stats = calculateTaskStats(member.tasks);


  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{member.name}</h1>
          <p className="text-gray-500 mt-1">{member.email}</p>
        </div>
        <button
          onClick={() => router.push("/team")}
          className="
                  inline-flex items-center gap-2
                  px-3 py-2 md:px-4
                  text-sm font-medium
                  text-gray-700
                  bg-white border border-gray-200
                  rounded-lg
                  hover:bg-gray-50
                  transition">
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden md:inline">Back to Team</span>
        </button>

      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<BarChart3 className="w-6 h-6" />}
          title="Total Tasks"
          value={member.totalTasks.toString()}
          subtitle={`${member.activeTasks} active`}
          color="blue"
        />
        <StatCard
          icon={<Zap className="w-6 h-6" />}
          title="Active Tasks"
          value={workload.activeTasks.toString()}
          subtitle="In progress"
          color="purple"
        />
        <StatCard
          icon={<AlertTriangle className="w-6 h-6" />}
          title="Overdue"
          value={workload.overdueTasks.toString()}
          subtitle="Need attention"
          color="red"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          subtitle={`${member.completedTasks} completed`}
          color="green"
        />
      </div>

      {/* Workload Score */}
      <DashboardCard
        icon={<BarChart3 className="w-6 h-6" />}
        title="Workload Analysis"
        description="Task distribution and workload score"
        color="purple"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Workload Score</span>
              <span className="text-2xl font-bold text-gray-900">{workload.score}</span>
            </div>
            <p className="text-xs text-gray-500">
              Based on active tasks (×2) and overdue tasks (×3)
            </p>
          </div>
          <div className="space-y-2">
            <MetricBar
              label="To Do"
              percentage={stats.todoPct}
              status="TODO"
            />
            <MetricBar
              label="In Progress"
              percentage={stats.inProgressPct}
              status="IN_PROGRESS"
            />
            <MetricBar
              label="Done"
              percentage={stats.donePct}
              status="DONE"
            />
          </div>
        </div>
      </DashboardCard>

      {/* Task List */}
      <DashboardCard
        icon={<CheckCircle2 className="w-6 h-6" />}
        title="All Tasks"
        description={`${member.tasks.length} total tasks`}
        color="blue"
      >
        <div className="mt-4 space-y-3">
          {member.tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No tasks assigned yet</p>
            </div>
          ) : (
            member.tasks.map((task: Task) => {
              const dueDate = task.dueDate ? new Date(task.dueDate) : null;
              const isOverdue = dueDate && task.status !== "DONE" && dueDate < new Date();

              return (
                <div
                  key={task.id}
                  className={`rounded-xl p-4 transition
                      ${isOverdue
                      ? "bg-red-50 border border-red-200"
                      : "bg-white border border-gray-100 hover:shadow-sm"
                    }
                     `}
                >

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm">
                        {/* Priority Badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${priorityStyles[task.priority]}`}>
                          <Flag className="w-4 h-4" />
                          {priorityLabels[task.priority]}
                        </span>
                         {/* Status Badge */}
                        <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md ${statusStyles[task.status as TaskStatus]}`}>
                          {statusLabels[task.status as TaskStatus]}
                        </span>
                        <span
                          className={`flex items-center gap-1.5 text-sm
                             ${isOverdue ? "text-red-600 font-medium" : "text-gray-500"}
                              `}
                        >

                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(task.dueDate)}
                        </span>
                        {isOverdue && (
                          <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-md">
                            <AlertTriangle className="w-3 h-3" />
                            Overdue
                          </span>
                        )}

                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DashboardCard>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Zap,
  BarChart3,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import { Task } from "@prisma/client";
import StatCard from "@/components/ui/StatCard";
import DashboardCard from "@/components/dashboard/DashboardCard";
import MetricBar from "@/components/ui/MetricBar";
import { calculateTaskStats } from "@/lib/task-metrics";
import { MemberTaskRow } from "@/components/team/TeamTaskRow";
import { EmptyTasksState, LoadingSkeleton } from "@/components/team/TeamComponents";

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

  if (loading) return <LoadingSkeleton />;
  if (!member) return null;

  const stats = calculateTaskStats(member.tasks);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

      {/* 1. Top Navigation & Info */}
      <section className="flex items-end justify-between border-b pb-6">
        <div>
          <button onClick={() => router.push("/team")} className="text-blue-600 text-sm font-medium flex items-center gap-1 mb-4 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Team
          </button>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{member.name}</h1>
          <p className="text-lg text-gray-500">{member.email}</p>
        </div>
      </section>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<BarChart3 />} title="Total Tasks" value={member.totalTasks.toString()} subtitle={`${member.activeTasks} active`} color="blue" />
        <StatCard icon={<Zap />} title="Active" value={member.workload.activeTasks.toString()} subtitle="In progress" color="purple" />
        <StatCard icon={<AlertTriangle />} title="Overdue" value={member.workload.overdueTasks.toString()} subtitle="Requires action" color="red" />
        <StatCard icon={<TrendingUp />} title="Success Rate" value={`${stats.completionRate}%`} subtitle="Tasks done" color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3. Workload Breakdown (Stânga - 1/3) */}
        <div className="lg:col-span-1 space-y-6">
          <DashboardCard icon={<BarChart3 />} title="Performance" description="Current distribution" color="purple">
            <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase">Workload Score</span>
              <div className="text-4xl font-black text-gray-900 my-1">{member.workload.score}</div>
              <p className="text-[10px] text-gray-500 leading-tight">Lower is better. Score is weighted by task urgency and delays.</p>
            </div>
            <div className="mt-6 space-y-4">
              <MetricBar label="To Do" percentage={stats.todoPct} status="TODO" />
              <MetricBar label="In Progress" percentage={stats.inProgressPct} status="IN_PROGRESS" />
              <MetricBar label="Done" percentage={stats.donePct} status="DONE" />
            </div>
          </DashboardCard>
        </div>

        {/* 4. Task History (Dreapta - 2/3) */}
        <div className="lg:col-span-2">
          <DashboardCard icon={<CheckCircle2 />} title="Member Tasks" description="History of all assigned work" color="blue">
            <div className="mt-4 space-y-3">
              {member.tasks.length === 0 ? (
                <EmptyTasksState />
              ) : (
                member.tasks.map((task) => <MemberTaskRow key={task.id} task={task} />)
              )}
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
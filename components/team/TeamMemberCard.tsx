import { calculatePercentage } from "@/lib/task-metrics";
import { CheckCircle2, Zap, BarChart3, TrendingUp } from "lucide-react";
import Link from "next/link";

type Props = {
  member: {
    id: string;
    name: string;
    email: string;
    totalTasks: number;
    completedTasks: number;
    activeTasks: number;
    workload: {
      score: number;
      overdueTasks: number;
    };
  };
};

export default function TeamMemberCard({ member }: Props) {

  const completionRate = calculatePercentage(member.completedTasks, member.totalTasks);

  return (
    <Link
      href={`/team/${member.id}`}
      className="block group"
    >
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all duration-200">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {member.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{member.email}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-blue-700 mb-1">
              <BarChart3 className="w-4 h-4" />
              <span className="text-xs font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{member.totalTasks}</p>
          </div>

          <div className="bg-purple-50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-purple-700 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-medium">Active</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{member.activeTasks}</p>
          </div>
        </div>

        {/* Completion Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Completed
            </span>
            <span className="font-semibold text-gray-900">{member.completedTasks}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Completion Rate
            </span>
            <span className="font-semibold text-gray-900">{completionRate}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Progress</span>
            <span>{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
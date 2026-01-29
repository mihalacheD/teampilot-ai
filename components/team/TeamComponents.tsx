export function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-8">
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
        <div className="h-10 w-1/3 bg-gray-200 rounded"></div>
        <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="h-64 bg-gray-50 rounded-2xl animate-pulse lg:col-span-1"></div>
        <div className="h-96 bg-gray-50 rounded-2xl animate-pulse lg:col-span-2"></div>
      </div>
    </div>
  );
}import { CheckCircle2 } from "lucide-react";

export function EmptyTasksState() {
  return (
    <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
        <CheckCircle2 className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900">No tasks found</h3>
      <p className="text-xs text-gray-500 mt-1 max-w-50 mx-auto">
        This team member doesn&apos;t have any tasks assigned at the moment.
      </p>
    </div>
  );
}
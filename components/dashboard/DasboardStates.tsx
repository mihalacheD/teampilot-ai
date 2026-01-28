import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

export function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-6 h-32"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-6 h-64"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-12 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Banner Skeleton */}
      <div className="bg-gray-200 rounded-2xl h-40"></div>
    </div>
  );
}

export function DashboardLoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
      <p className="text-gray-600 font-medium">Loading dashboard...</p>
      <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
    </div>
  );
}

type DashboardErrorProps = {
  message: string;
  onRetry?: () => void;
};

export function DashboardError({ message, onRetry }: DashboardErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Unable to Load Dashboard
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-sm hover:shadow-md"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}

type EmptyStateProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function DashboardEmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-sm hover:shadow-md"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
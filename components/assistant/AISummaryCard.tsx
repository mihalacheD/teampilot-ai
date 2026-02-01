"use client";

import { useEffect } from "react";
import { useAISummary } from "@/hooks/useAiSummary";
import {
  Sparkles,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

export function AISummaryCard() {
  const {
    summary,
    loading,
    error,
    cached,
    fetchSummary,
    regenerate,
    rateLimit,
  } = useAISummary();

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Loading initial
  if (loading && !summary) {
    return (
      <div className="bg-linear-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="font-medium">Generating AI insights...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 mb-1">
              Failed to generate AI summary
            </h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button
            onClick={fetchSummary}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  // Compute if user can regenerate
  const canRegenerate = !rateLimit || rateLimit.remaining > 0;

  return (
    <div className="bg-linear-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-xl font-bold">AI Daily Snapshot</h3>
            <p className="text-purple-100 text-sm max-w-md">
              {cached
                ? "Generated earlier today · reflects current task state"
                : "Freshly regenerated · based on latest tasks"}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-purple-100 opacity-80">
              {rateLimit
                ? `Regenerations left: ${rateLimit.remaining}`
                : cached
                ? "Cached today"
                : "Generated just now"}
            </span>

            <button
              onClick={regenerate}
              disabled={loading || !canRegenerate}
              className={`p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              title={
                canRegenerate
                  ? "Regenerate summary"
                  : "Daily regeneration limit reached"
              }
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>

          {!canRegenerate && (
            <p className="text-xs text-yellow-200 opacity-80">
              Daily regeneration limit reached. Try again tomorrow.
            </p>
          )}
        </div>
      </div>

      {/* Insights */}
      {summary.insights && (
        <div className="mb-6 p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
          <p className="text-sm leading-relaxed">{summary.insights}</p>
        </div>
      )}

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: "completed", title: "Completed", icon: CheckCircle, color: "green" },
          { key: "ongoing", title: "In Progress", icon: Clock, color: "blue" },
          { key: "upcoming", title: "Upcoming", icon: TrendingUp, color: "yellow" },
          { key: "risks", title: "Risks & Alerts", icon: AlertTriangle, color: "red" },
        ].map(({ key, title, icon: Icon, color }) => {
          const items = summary[key as keyof typeof summary] as string[];
          if (!items || items.length === 0) return null;

          return (
            <div
              key={key}
              className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-4 h-4 text-${color}-300`} />
                <h4 className="font-semibold text-sm">{title}</h4>
              </div>
              <ul className="space-y-2">
                {items.map((item, i) => (
                  <li
                    key={i}
                    className="text-sm text-purple-100 flex items-start gap-2"
                  >
                    <span className={`text-${color}-300 mt-1`}>
                      {key === "completed" ? "✓" : key === "ongoing" ? "→" : key === "upcoming" ? "◆" : "!"}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

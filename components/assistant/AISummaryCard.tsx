"use client";

import { useEffect } from "react";
import { useAISummary } from "@/hooks/useAiSummary";
import { Sparkles, RefreshCw, Loader2, AlertCircle, CheckCircle, Clock, TrendingUp, AlertTriangle } from "lucide-react";

export function AISummaryCard() {
  const { summary, loading, error, cached, fetchSummary, regenerate } = useAISummary();

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 mb-1">Failed to generate AI summary</h3>
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
            <h3 className="text-xl font-bold">AI Insights</h3>
            <p className="text-purple-100 text-sm max-w-md">
              To save API costs, this summary is cached. Click regenerate to see live AI analysis.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-purple-100 opacity-80">
            {cached ? "Cached today" : "Generated just now"}
          </span>

          <button
            onClick={regenerate}
            disabled={loading}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Regenerate summary"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
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
        {/* Completed */}
        {summary.completed.length > 0 && (
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-300" />
              <h4 className="font-semibold text-sm">Completed</h4>
            </div>
            <ul className="space-y-2">
              {summary.completed.map((item, i) => (
                <li key={i} className="text-sm text-purple-100 flex items-start gap-2">
                  <span className="text-green-300 mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Ongoing */}
        {summary.ongoing.length > 0 && (
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-blue-300" />
              <h4 className="font-semibold text-sm">In Progress</h4>
            </div>
            <ul className="space-y-2">
              {summary.ongoing.map((item, i) => (
                <li key={i} className="text-sm text-purple-100 flex items-start gap-2">
                  <span className="text-blue-300 mt-1">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Upcoming */}
        {summary.upcoming.length > 0 && (
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-yellow-300" />
              <h4 className="font-semibold text-sm">Upcoming</h4>
            </div>
            <ul className="space-y-2">
              {summary.upcoming.map((item, i) => (
                <li key={i} className="text-sm text-purple-100 flex items-start gap-2">
                  <span className="text-yellow-300 mt-1">◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risks */}
        {summary.risks.length > 0 && (
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-300" />
              <h4 className="font-semibold text-sm">Risks & Alerts</h4>
            </div>
            <ul className="space-y-2">
              {summary.risks.map((item, i) => (
                <li key={i} className="text-sm text-purple-100 flex items-start gap-2">
                  <span className="text-red-300 mt-1">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
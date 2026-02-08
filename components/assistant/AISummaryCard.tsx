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
  Zap,
  Wand2
} from "lucide-react";

export function AISummaryCard() {
  const { summary, loading, error, cached, rateLimit, hasGenerated, fetchSummary, generateSummary } = useAISummary();

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Empty State - No Summary Generated Yet
  if (!hasGenerated && !loading && !error) {
    return (
      <div className="bg-linear-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex flex-col items-center justify-center text-center py-8">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <Wand2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-2">AI Insights Available</h3>
          <p className="text-purple-100 mb-6 max-w-md">
            Get intelligent recommendations and analysis of your team&apos;s tasks powered by AI.
          </p>

          {rateLimit && (
            <p className="text-sm text-purple-200 mb-4">
              {rateLimit.remaining === 1 ? "1 generation available today" : "Daily generation used"}
            </p>
          )}

          <button
            onClick={generateSummary}
            disabled={loading || (rateLimit?.remaining === 0)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate AI Insights
              </>
            )}
          </button>

          {rateLimit?.remaining === 0 && (
            <p className="text-xs text-purple-200 mt-3">
              Limit reached. Resets at {new Date(rateLimit.resetAt).toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Loading State (only on first load)
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

  // Error State
  if (error) {
    const is429 = error.includes("limit");

    return (
      <div className={`border rounded-2xl p-6 ${is429 ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200"}`}>
        <div className="flex items-start gap-3">
          {is429 ? (
            <Zap className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
          )}
          <div className="flex-1">
            <h3 className={`font-semibold mb-1 ${is429 ? "text-yellow-900" : "text-red-900"}`}>
              {is429 ? "Daily Limit Reached" : "Failed to generate AI summary"}
            </h3>
            <p className={`text-sm mb-3 ${is429 ? "text-yellow-700" : "text-red-700"}`}>{error}</p>
            {rateLimit && (
              <p className="text-xs text-gray-600">
                Resets tomorrow at {new Date(rateLimit.resetAt).toLocaleTimeString()}
              </p>
            )}
          </div>
          {!is429 && (
            <button
              onClick={fetchSummary}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!summary) return null;

  // Summary Display
  return (
    <div className="bg-linear-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">AI Insights</h3>
            <p className="text-purple-100 text-sm">
              {cached ? "Generated today" : "Just generated"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Rate Limit Badge */}
          {rateLimit && (
            <div className="px-3 py-1.5 bg-white/20 rounded-lg text-xs font-medium">
              {rateLimit.remaining === 0 ? "Used today" : "1 left today"}
            </div>
          )}

          <button
            onClick={generateSummary}
            disabled={loading || (rateLimit?.remaining === 0)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={rateLimit?.remaining === 0 ? "Daily limit reached - resets tomorrow" : "Regenerate summary"}
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
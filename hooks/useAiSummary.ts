/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import api from "@/lib/axios";
import { DailySummary } from "@/lib/ai/ai-helpers";


type SummaryResponse = {
  summary: DailySummary;
  cached: boolean;
  generatedAt: Date;
  rateLimit?: {
    remaining: number;
    resetAt: Date;
  };
};

export function useAISummary() {
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState(false);
  const [rateLimit, setRateLimit] = useState<{
    remaining: number;
    resetAt: Date;
  } | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post<SummaryResponse>("/ai/summary");
      setSummary(response.data.summary);
      setCached(response.data.cached);
      setRateLimit(response.data.rateLimit || null);
    } catch (err: any) {
      console.error("Error fetching AI summary:", err);
      setError(err.message || "Failed to generate AI summary");
      setSummary(null);

      // Extract rate limit from error response
      if (err.data?.rateLimit) {
        setRateLimit(err.data.rateLimit);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const regenerate = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post<{
        summary: DailySummary;
        rateLimit?: { remaining: number; resetAt: Date };
      }>("/ai/regenerate");
      setSummary(response.data.summary);
      setCached(false);
      setRateLimit(response.data.rateLimit || null);
    } catch (err: any) {
      console.error("Error regenerating summary:", err);
      setError(err.message || "Failed to regenerate summary");

      // Extract rate limit from error response
      if (err.data?.rateLimit) {
        setRateLimit(err.data.rateLimit);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    summary,
    loading,
    error,
    cached,
    rateLimit,
    fetchSummary,
    regenerate,
  };
}

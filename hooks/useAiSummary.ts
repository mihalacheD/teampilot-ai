import { useState, useCallback } from "react";
import api from "@/lib/axios";
import { DailySummary } from "@/lib/ai/ai-helpers";

type SummaryResponse = {
  summary: DailySummary | null;
  cached: boolean;
  generatedAt?: Date;
  message?: string;
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
  const [hasGenerated, setHasGenerated] = useState(false);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<SummaryResponse>("/ai/summary");
      setSummary(response.data.summary);
      setCached(response.data.cached);
      setRateLimit(response.data.rateLimit || null);
      setHasGenerated(response.data.summary !== null);
    } catch (err: unknown) {
      console.error("Error fetching AI summary:", err);
      const error = err as {
        message?: string;
        data?: { rateLimit?: { remaining: number; resetAt: Date } };
      };
      setError(error.message || "Failed to fetch AI summary");
      setSummary(null);

      if (error.data?.rateLimit) {
        setRateLimit(error.data.rateLimit);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const generateSummary = useCallback(async () => {
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
      setHasGenerated(true);
    } catch (err: unknown) {
      console.error("Error generating summary:", err);
      const error = err as {
        message?: string;
        data?: { rateLimit?: { remaining: number; resetAt: Date } };
      };
      setError(error.message || "Failed to generate summary");

      if (error.data?.rateLimit) {
        setRateLimit(error.data.rateLimit);
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
    hasGenerated,
    fetchSummary,
    generateSummary,
  };
}

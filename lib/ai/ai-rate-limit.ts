import { prisma } from "@/lib/prisma";
import { getTodayKey } from "@/lib/ai/ai-helpers";

export const RATE_LIMITS = {
  MAX_REGENERATIONS_PER_DAY: 1,
  CACHE_DURATION_HOURS: 24,
} as const;

export async function checkRateLimit(): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}> {
  const today = getTodayKey();
  const summary = await prisma.dailySummary.findUnique({
    where: { date: today },
  });

  const count = summary?.regenerateCount || 0;
  const remaining = Math.max(0, RATE_LIMITS.MAX_REGENERATIONS_PER_DAY - count);

  // Reset time is tomorrow at midnight
  const resetAt = new Date(today);
  resetAt.setDate(resetAt.getDate() + 1);

  return {
    allowed: count < RATE_LIMITS.MAX_REGENERATIONS_PER_DAY,
    remaining,
    resetAt,
  };
}

export async function incrementRegenerateCount(): Promise<void> {
  const today = getTodayKey();
  await prisma.dailySummary.upsert({
    where: { date: today },
    update: {
      regenerateCount: { increment: 1 },
    },
    create: {
      date: today,
      summary: {},
      regenerateCount: 1,
    },
  });
}

export async function canGenerateSummary(): Promise<{
  canGenerate: boolean;
  reason?: string;
  resetAt?: Date;
}> {
  const rateLimit = await checkRateLimit();

  if (!rateLimit.allowed) {
    return {
      canGenerate: false,
      reason: `Daily limit reached (${RATE_LIMITS.MAX_REGENERATIONS_PER_DAY} generation per day)`,
      resetAt: rateLimit.resetAt,
    };
  }

  return { canGenerate: true };
}

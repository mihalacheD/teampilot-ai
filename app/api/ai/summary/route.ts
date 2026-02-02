import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getTodayKey,
  DailySummary,
} from "@/lib/ai/ai-helpers";
import { checkRateLimit } from "@/lib/ai/ai-rate-limit";
import { getAuthenticatedSession, successResponse, unauthorizedResponse } from "@/lib/api/api-helpers";

export async function GET() {
  const session = await getAuthenticatedSession();

  if (!session) {
    return unauthorizedResponse();
  }

  try {
    const today = getTodayKey();

    // fetch from DB
    const cached = await prisma.dailySummary.findUnique({
      where: { date: today },
    });

    const rateLimit = await checkRateLimit();

    if (!cached || !cached.summary || Object.keys(cached.summary).length === 0) {
      // No summary exists yet - user needs to generate manually
      return successResponse({
        summary: null,
        cached: false,
        rateLimit: {
          remaining: rateLimit.remaining,
          resetAt: rateLimit.resetAt,
        },
        message: "No summary available. Click 'Generate' to create one.",
      });
    }

    return successResponse({
      summary: cached.summary as DailySummary,
      cached: true,
      generatedAt: cached.createdAt,
      rateLimit: {
        remaining: rateLimit.remaining,
        resetAt: rateLimit.resetAt,
      },
    });
  } catch (error) {
    console.error("[AI_SUMMARY_GET_ERROR]:", error);
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { openai, AI_CONFIG } from "@/lib/ai/openai";
import {
  getTodayKey,
  formatTasksForAI,
  buildSummaryPrompt,
  validateSummary,
} from "@/lib/ai/ai-helpers";
import {
  getAuthenticatedSession,
  unauthorizedResponse,
  forbiddenResponse,
  serverErrorResponse,
  successResponse,
} from "@/lib/api/api-helpers";
import { checkRateLimit } from "@/lib/ai/ai-rate-limit";
import OpenAI from "openai";
import { Prisma } from "@prisma/client";
import { assertCanRegenerate } from "@/lib/ai/ai-guard";

export async function POST() {
  const session = await getAuthenticatedSession();

  if (!session) {
    return unauthorizedResponse();
  }

  if (session.user.role !== "MANAGER") {
    return forbiddenResponse("Only managers can regenerate AI summaries", { isDemo: false });
  }

  try {
    const today = getTodayKey();

    const dailySummary = await prisma.dailySummary.findUnique({
      where: { date: today },
    });
    assertCanRegenerate(dailySummary?.regenerateCount);
    // 1️⃣ Check rate limit BEFORE regenerating
    const rateLimit = await checkRateLimit();

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Daily regeneration limit reached (3/day). Resets at ${rateLimit.resetAt.toLocaleTimeString()}.`,
          rateLimit: {
            remaining: rateLimit.remaining,
            resetAt: rateLimit.resetAt,
          },
        },
        { status: 429 },
      );
    }

    // 2️⃣ Load tasks
    const tasks = await prisma.task.findMany({
      select: {
        title: true,
        status: true,
        dueDate: true,
      },
      orderBy: [{ status: "asc" }, { dueDate: "asc" }],
    });

    if (tasks.length === 0) {
      const emptySummary = {
        completed: [],
        ongoing: [],
        upcoming: [],
        risks: [],
        insights: "No tasks found. Create your first task to get started!",
      };

      // Save empty summary and increment counter
      await prisma.dailySummary.upsert({
        where: { date: today },
        update: {
          summary: emptySummary,
          regenerateCount: { increment: 1 },
        },
        create: {
          date: today,
          summary: emptySummary,
          regenerateCount: 1,
        },
      });

      return successResponse({
        summary: emptySummary,
        rateLimit: {
          remaining: rateLimit.remaining - 1,
          resetAt: rateLimit.resetAt,
        },
      });
    }

    const tasksText = formatTasksForAI(tasks);
    const prompt = buildSummaryPrompt(tasksText);

    // 3️⃣ Call OpenAI
    const response = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.maxTokens,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Empty AI response");
    }

    const summary = JSON.parse(content);

    if (!validateSummary(summary)) {
      throw new Error("Invalid summary structure");
    }

    // 4️⃣ Save and increment counter
    await prisma.dailySummary.upsert({
      where: { date: today },
      update: {
        summary: summary as unknown as Prisma.InputJsonValue,
        regenerateCount: { increment: 1 },
      },
      create: {
        date: today,
        summary: summary as unknown as Prisma.InputJsonValue,
        regenerateCount: 1,
      },
    });

    return successResponse({
      summary,
      rateLimit: {
        remaining: rateLimit.remaining - 1,
        resetAt: rateLimit.resetAt,
      },
    });
  } catch (error) {
    console.error("[AI_REGENERATE_ERROR]:", error);

    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        return serverErrorResponse(
          "OpenAI rate limit exceeded. Please wait a moment.",
        );
      }
    }

    return serverErrorResponse(
      error instanceof Error ? error.message : "Failed to regenerate summary",
    );
  }
}

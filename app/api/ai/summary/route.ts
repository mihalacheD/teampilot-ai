import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { openai, AI_CONFIG } from "@/lib/ai/openai";
import {
  getTodayKey,
  formatTasksForAI,
  buildSummaryPrompt,
  validateSummary,
  DailySummary,
} from "@/lib/ai/ai-helpers";
import {
  getAuthenticatedSession,
  serverErrorResponse,
  successResponse,
  unauthorizedResponse,
} from "@/lib/api/api-helpers";
import { checkRateLimit } from "@/lib/ai/ai-rate-limit";
import { Prisma } from "@prisma/client";

export async function POST() {
  const session = await getAuthenticatedSession();

  if (!session) {
    return unauthorizedResponse();
  }

  try {
    const today = getTodayKey();

    // 1️⃣ Check cache FIRST (no rate limit for cached results)
    const cached = await prisma.dailySummary.findUnique({
      where: { date: today },
    });

    if (cached && cached.summary && Object.keys(cached.summary).length > 0) {
      const rateLimit = await checkRateLimit();

      return successResponse({
        summary: cached.summary as DailySummary,
        cached: true,
        generatedAt: cached.createdAt,
        rateLimit: {
          remaining: rateLimit.remaining,
          resetAt: rateLimit.resetAt,
        },
      });
    }

    // 2️⃣ Only check rate limit if we need to generate
    const rateLimit = await checkRateLimit();

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Daily generation limit reached. You can regenerate ${rateLimit.remaining} more time(s) today.`,
          rateLimit: {
            remaining: rateLimit.remaining,
            resetAt: rateLimit.resetAt,
          },
        },
        { status: 429 },
      );
    }

    // 3️⃣ Load tasks
    const tasks = await prisma.task.findMany({
      select: {
        title: true,
        status: true,
        dueDate: true,
      },
      orderBy: [{ status: "asc" }, { dueDate: "asc" }],
    });

    if (tasks.length === 0) {
      return successResponse({
        summary: {
          completed: [],
          ongoing: [],
          upcoming: [],
          risks: [],
          insights: "No tasks found. Create your first task to get started!",
        },
        cached: false,
        rateLimit: {
          remaining: rateLimit.remaining - 1,
          resetAt: rateLimit.resetAt,
        },
      });
    }

    const tasksText = formatTasksForAI(tasks);
    const prompt = buildSummaryPrompt(tasksText);

    // 4️⃣ Call OpenAI
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

    // 5️⃣ Parse and validate
    let summary: DailySummary;
    try {
      summary = JSON.parse(content);
    } catch (err) {
      console.error("Failed to parse AI response:", err);
      throw new Error("Invalid AI response format");
    }

    if (!validateSummary(summary)) {
      console.error("Invalid summary structure:", summary);
      throw new Error("AI returned invalid summary structure");
    }

    // 6️⃣ Save to cache and increment counter
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
      cached: false,
      generatedAt: new Date(),
      rateLimit: {
        remaining: rateLimit.remaining - 1,
        resetAt: rateLimit.resetAt,
      },
    });
  } catch (error) {
    console.error("[AI_SUMMARY_ERROR]:", error);

    if (error instanceof OpenAI.APIError) {
      console.error("OpenAI API Error:", {
        status: error.status,
        message: error.message,
        code: error.code,
      });

      if (error.status === 401) {
        return serverErrorResponse("Invalid API key configuration");
      }

      if (error.status === 429) {
        return serverErrorResponse(
          "OpenAI rate limit exceeded. Please try again later.",
        );
      }
    }

    return serverErrorResponse(
      error instanceof Error ? error.message : "Failed to generate summary",
    );
  }
}

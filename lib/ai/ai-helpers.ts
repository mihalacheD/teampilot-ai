import { Task } from "@/generated/prisma/client";
import { formatDate } from "@/lib/date";

export type DailySummary = {
  completed: string[];
  ongoing: string[];
  upcoming: string[];
  risks: string[];
  insights?: string;
};

export function getTodayKey(): Date {
  const date = new Date();
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function formatTasksForAI(tasks: Pick<Task, "title" | "status" | "dueDate">[]): string {
  if (tasks.length === 0) return "No tasks available";

  return tasks
    .map((task) => {
      const status = task.status.replace("_", " ");
      const dueDate = task.dueDate ? formatDate(task.dueDate) : "No due date";
      return `• ${task.title} | ${status} | ${dueDate}`;
    })
    .join("\n");
}

export function buildSummaryPrompt(tasksText: string): string {
  const today = new Date().toLocaleDateString();
  return `You are a task management assistant. Today is ${today}.

Tasks:
${tasksText}

Return ONLY valid JSON with this exact structure:
{
  "completed": ["task1", "task2"],
  "ongoing": ["task3", "task4"],
  "upcoming": ["task5", "task6"],
  "risks": ["risk1", "risk2"],
  "insights": "Brief 1-sentence overall insight"
}

Rules:
- Max 5 items per array
- Use short, clear phrases
- Identify overdue tasks in risks
- insights should be actionable
- Return ONLY the JSON object, no markdown or explanation`;
}

export function validateSummary(summary: unknown): summary is DailySummary {
  if (!summary || typeof summary !== "object") return false;

  const s = summary as Record<string, unknown>;

  return (
    Array.isArray(s.completed) &&
    Array.isArray(s.ongoing) &&
    Array.isArray(s.upcoming) &&
    Array.isArray(s.risks) &&
    s.completed.every((item) => typeof item === "string") &&
    s.ongoing.every((item) => typeof item === "string") &&
    s.upcoming.every((item) => typeof item === "string") &&
    s.risks.every((item) => typeof item === "string")
  );
}
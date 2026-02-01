import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 second timeout
  maxRetries: 2,
});

export const AI_CONFIG = {
  model: process.env.OPENAI_MODEL || "gpt-4o-mini",
  temperature: 0.2,
  maxTokens: 300,
} as const;
import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { GoogleGenAI } from "@google/genai";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown error";
  }
}

export const generateCourseSummary = action({
  args: {
    courseId: v.id("courses"),
    courseTitle: v.string(),
    courseDescription: v.string(),
    lectures: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const genAI = new GoogleGenAI({ apiKey });

    const prompt = [
      "You are an expert educational consultant.",
      "Generate a concise, engaging, professional course summary.",
      "",
      `COURSE TITLE: ${args.courseTitle}`,
      `DESCRIPTION: ${args.courseDescription}`,
      `LECTURE TOPICS: ${args.lectures.join(", ")}`,
      "",
      "Output requirements:",
      "- 3 to 4 sentences",
      "- Highlight value proposition and outcomes",
      "- Premium and encouraging tone",
      "- Plain text only, no markdown",
    ].join("\n");

    const models = ["gemini-2.5-flash"];
    const modelErrors: string[] = [];

    let summary = "";

    for (const model of models) {
      try {
        const result = await genAI.models.generateContent({
          model,
          contents: prompt,
        });

        const candidate = result.text?.trim() ?? "";
        if (candidate.length > 0) {
          summary = candidate;
          break;
        }

        modelErrors.push(`${model}: empty response`);
      } catch (error: unknown) {
        modelErrors.push(`${model}: ${getErrorMessage(error)}`);
      }
    }

    if (!summary) {
      throw new Error(
        `Failed to generate summary with Gemini. Attempts: ${modelErrors.join(" | ")}`,
      );
    }

    await ctx.runMutation(api.courses.updateCourseSummary, {
      courseId: args.courseId,
      summary,
    });

    return summary;
  },
});

"use server";

import { summarizeLecture } from "@/lib/gemini";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cleanTranscript, SYNTHESIS_TEMPLATE } from "../utils/ai.utils";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * GENERATE COURSE SUMMARY ACTION (SERVER-SIDE)
 * The definitive engine for knowledge extraction and persistence.
 * Orchestrates the transition from raw text to refined insight.
 */
export async function generateCourseSummary(courseId: Id<"courses">, rawContent: string) {
  try {
    // Stage 1: Data Preparation
    const sanitized = cleanTranscript(rawContent);
    const complexPrompt = SYNTHESIS_TEMPLATE(sanitized);

    // Stage 2: AI Execution
    const refinedSummary = await summarizeLecture(complexPrompt);

    // Stage 3: Persistence (Commit to global state)
    await convex.mutation(api.courses.updateCourseSummary, {
      courseId,
      summary: refinedSummary
    });

    return { 
      success: true, 
      summary: refinedSummary,
      timestamp: Date.now()
    };
  } catch (err) {
    console.error("Knowledge Synthesis Action Error:", err);
    return { success: false, error: "The Knowledge Synthesis Engine has experienced a momentary misalignment." };
  }
}

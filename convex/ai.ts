import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { GoogleGenAI } from "@google/genai";

export const generateCourseSummary = action({
  args: { 
    courseId: v.id("courses"), 
    courseTitle: v.string(), 
    courseDescription: v.string(),
    lectures: v.array(v.string()) 
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

    // Correctly initialize with options object
    const genAI = new GoogleGenAI({ apiKey });
    
    const prompt = `
      You are an expert educational consultant. Generate a concise, engaging, and professional summary for a course platform.
      
      COURSE TITLE: ${args.courseTitle}
      DESCRIPTION: ${args.courseDescription}
      LECTURE TOPICS: ${args.lectures.join(", ")}
      
      Generate a 3-4 sentence summary that highlights the value proposition and key learning outcomes of this course. 
      Keep the tone encouraging, premium, and professional. 
      Do not use any markdown formatting in the output, just plain text.
    `;

    try {
      const result = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      // text is a getter in the @google/genai SDK
      const summary = result.text?.trim() || "";

      if (!summary) throw new Error("AI returned an empty response.");

      // Save the summary back to the database
      await ctx.runMutation(api.courses.updateCourseSummary, {
        courseId: args.courseId,
        summary: summary,
      });

      return summary;
    } catch (error: any) {
      console.error("Gemini Error:", error);
      throw new Error("Failed to generate summary with Gemini 2.0 Flash.");
    }
  },
});

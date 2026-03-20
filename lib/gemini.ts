import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Gemini AI SDK Client
 * Powering the knowledge synthesis engine of EduFlow.
 */

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  console.warn("NEXT_PUBLIC_GEMINI_API_KEY is missing. Gemini features will be disabled.");
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 2048,
  }
});

/**
 * Summarize Lecture Content
 * Generates a high-impact synthesis from a provided transcript or text.
 */
export async function summarizeLecture(content: string) {
  try {
    const prompt = `
      You are an expert academic synthesizer. 
      Act as a high-level educational assistant for the platform "eduFlow".
      Provide a comprehensive, high-impact summary of the following lecture content.
      
      STRUCTURE YOUR RESPONSE AS FOLLOWS:
      1. KNOWLEDGE PILLARS: List the core concepts discussed.
      2. PRACTICAL SYNTHESIS: Explain how this applies in real-world scenarios.
      3. CRITICAL TAKEAWAY: One-sentence high-impact insight.

      CONTENT TO SUMMARIZE:
      ${content}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Summarization Error:", error);
    return "The knowledge synthesis engine is momentarily recalibrating. Please try again shortly.";
  }
}

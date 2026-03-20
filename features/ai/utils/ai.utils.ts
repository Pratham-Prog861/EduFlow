/**
 * AI UTILITY ARCHIVE
 * Standardized data preparation for the Gemini Synthesis engine.
 */

export function cleanTranscript(text: string): string {
  // Remove filler words, timestamps, and redundant whitespace
  return text
    .replace(/\[\d{2}:\d{2}\]/g, "") // Remove [00:00] timestamps
    .replace(/\s+/g, " ")
    .trim();
}

export function formatSynthesis(rawText: string): string {
  // Ensure we have a high-impact presentation of the AI output
  return rawText
    .replace(/(\d\.)/g, "\n$1")
    .split("\n")
    .filter(line => line.length > 0)
    .join("\n\n");
}

export const SYNTHESIS_TEMPLATE = (content: string) => `
  [SYSTEM_OVERRIDE]: Synthesize the following educational content.
  Objective: Maximize information density and learning retention.
  Target: Graduate-level precision.

  CONTENT ARCHIVE:
  ${content}
`;

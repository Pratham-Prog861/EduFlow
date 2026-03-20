"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { generateCourseSummary } from "../actions/generate-summary";

/**
 * useAISummary Hook
 * A high-performance interface for managing the knowledge synthesis lifecycle.
 */
export function useAISummary(courseId: Id<"courses">) {
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSynthesis = async (rawContent: string) => {
    if (!rawContent || rawContent.length < 50) {
      toast.error("DATA DEFICIT: Insufficient lecture content for synthesis.");
      return;
    }

    try {
      setIsSynthesizing(true);
      setError(null);
      
      const result = await generateCourseSummary(courseId, rawContent);

      if (result.success) {
        toast.success("KNOWLEDGE SYNTHESIS COMPLETE: Insight propagated across all nodes.");
        return result.summary;
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      setError(err?.message || "SYNTHESIS MISALIGNMENT");
      toast.error(`SYSTEM ERROR: ${err?.message || "Unknown synthesis failure."}`);
    } finally {
      setIsSynthesizing(false);
    }
  };

  return {
    performSynthesis,
    isSynthesizing,
    error,
    isReady: !isSynthesizing && !error
  };
}

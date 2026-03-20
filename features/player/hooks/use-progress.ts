"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { toast } from "sonner";

/**
 * useProgress Hook
 * High-performance academic trajectory tracking.
 * Manages the transition from student interaction to institutional records.
 */
export function useProgress(courseId: Id<"courses">, lectureId: Id<"lectures">) {
  const [isUpdating, setIsUpdating] = useState(false);
  const markAsCompleteMutation = useMutation(api.progress.markAsComplete);
  const isCompleted = useQuery(api.progress.getLectureProgress, { lectureId });

  const toggleCompletion = async () => {
    try {
      setIsUpdating(true);
      await markAsCompleteMutation({
        courseId,
        lectureId,
        completed: !isCompleted
      });
      
      if (!isCompleted) {
        toast.success("MASTERY SECURED: Knowledge point successfully archived.");
      } else {
        toast.info("ARCHIVE UPDATED: Knowledge point returned to active state.");
      }
    } catch (err) {
      console.error("Progress Tracking Failure:", err);
      toast.error("SYSTEM ERROR: Unable to commit knowledge point completion.");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isCompleted: !!isCompleted,
    isUpdating,
    toggleCompletion
  };
}

/**
 * useCourseMastery Hook
 * Aggregates complete trajectory data for a specific learning path.
 */
export function useCourseMastery(courseId: Id<"courses">) {
  const progress = useQuery(api.progress.getProgressByCourse, { courseId });
  const isLoading = progress === undefined;

  const completedCount = progress?.filter(p => p.completed).length || 0;
  const totalCount = progress?.length || 0;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    percentage,
    completedCount,
    totalCount,
    isLoading
  };
}

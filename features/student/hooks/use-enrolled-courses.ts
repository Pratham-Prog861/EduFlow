"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * useEnrolledCourses Hook
 * A high-speed interface for retrieving the learner's active knowledge paths.
 * Orchestrates filtering between completed and active curriculum.
 */
export function useEnrolledCourses() {
  const courses = useQuery(api.enrollments.getEnrolledCourses, {});

  const isLoading = courses === undefined;
  const isEmpty = !isLoading && courses.length === 0;

  return {
    courses: courses || [],
    isLoading,
    isEmpty,
    count: courses?.length || 0,
    hasContent: !isLoading && !isEmpty,
  };
}

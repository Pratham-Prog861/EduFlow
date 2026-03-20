"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * useInstructorCourses Hook
 * A high-fidelity data stream for retrieving academic assets managed by the current identity.
 */
export function useInstructorCourses() {
  const courses = useQuery(api.courses.getInstructorCourses);
  
  const isLoading = courses === undefined;
  const isEmpty = !isLoading && courses.length === 0;

  return {
    courses: courses || [],
    isLoading,
    isEmpty,
    count: courses?.length || 0,
    hasContent: !isLoading && !isEmpty
  };
}

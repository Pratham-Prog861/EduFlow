"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

/**
 * useCourse Hook
 * A high-performance interface to pull specific course telemetry and structural data.
 * Ideal for public landing pages and student enrollment previews.
 */
export function useCourse(courseId: Id<"courses">) {
  const course = useQuery(api.courses.getCourseById, { courseId });
  const sections = useQuery(api.sections.getSectionsByCourse, { courseId });
  const lectures = useQuery(api.lectures.getLecturesByCourse, { courseId });
  
  // Potential context: Check if user is enrolled
  const isEnrolled = useQuery(api.enrollments.checkEnrollment, { courseId });

  const isLoading = course === undefined || sections === undefined || lectures === undefined || isEnrolled === undefined;
  
  return {
    course,
    sections,
    lectures,
    isEnrolled: !!isEnrolled,
    isLoading,
  };
}

"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useMemo } from "react";
import { searchCourses } from "../utils/course.utils";

/**
 * useCourses Hook
 * High-performance access to the entire knowledge catalog.
 * Features built-in search and filtering optimizations.
 */
export function useCourses() {
  const courses = useQuery(api.courses.getCoursesForStudents);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    if (!searchQuery) return courses;
    return searchCourses(courses, searchQuery);
  }, [courses, searchQuery]);

  const isLoading = courses === undefined;
  const isEmpty = !isLoading && filteredCourses.length === 0;

  return {
    courses: filteredCourses,
    allCourses: courses || [],
    searchQuery,
    setSearchQuery,
    isLoading,
    isEmpty,
    count: filteredCourses.length
  };
}

/**
 * useInstructorCourses Hook
 * Pulls all content authored by the current identifying cluster.
 */
export function useInstructorCourses() {
  const courses = useQuery(api.courses.getInstructorCourses);
  
  const isLoading = courses === undefined;
  const isEmpty = !isLoading && courses.length === 0;

  return {
    courses: courses || [],
    isLoading,
    isEmpty,
    count: courses?.length || 0
  };
}

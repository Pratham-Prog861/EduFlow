import { Course } from "@/types/course";

/**
 * COURSE UTILITY BOX
 * Helping functions for calculations and formatting related to learning paths.
 */

export function calculateCourseProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function filterCoursesByCategory(courses: Course[], category: string) {
  if (category === "all") return courses;
  // This expects courses to have a category field which we might need to add to schema or meta
  return courses; 
}

export function searchCourses(courses: Course[], query: string) {
  const searchTerm = query.toLowerCase();
  return courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm) || 
    course.description.toLowerCase().includes(searchTerm)
  );
}

export const COURSE_MESSAGES = {
  EMPTY_CATALOG: "No courses currently found in this cluster.",
  ENROLLMENT_SUCCESS: "You have been successfully authorized for this learning path.",
  CREATION_SUCCESS: "New knowledge stream has been initialized.",
};

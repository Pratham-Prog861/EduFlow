import { Id } from "@/convex/_generated/dataModel";

/**
 * EDUFLOW COURSE ARCHITECTURE
 * Core structural types for curriculum and enrollment.
 */

export interface Course {
  _id: Id<"courses">;
  _creationTime: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  instructorId: Id<"users">;
  aiSummary?: string;
  isPublished?: boolean; // For future visibility guards
}

export interface Section {
  _id: Id<"sections">;
  courseId: Id<"courses">;
  title: string;
  order: number;
}

export interface CourseCategory {
  label: string;
  value: string;
  icon?: string;
}

export interface CourseWithStats extends Course {
  enrolledStudents: number;
  rating: number;
  totalLectures: number;
  durationString: string;
}

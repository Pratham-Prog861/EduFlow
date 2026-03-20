import { Id } from "@/convex/_generated/dataModel";

/**
 * EDUFLOW PROGRESS TRACKING
 * Academic performance and completion metrics.
 */

export interface LectureProgress {
  _id: Id<"progress">;
  _creationTime: number;
  userId: Id<"users">;
  courseId: Id<"courses">;
  lectureId: Id<"lectures">;
  completed: boolean;
  completionDate?: number;
}

export interface Enrollment {
  _id: Id<"enrollments">;
  _creationTime: number;
  userId: Id<"users">;
  courseId: Id<"courses">;
}

export interface MasteryMetrics {
  overallPercentage: number;
  lecturesCompleted: number;
  totalLectures: number;
  lastAccessed: number;
}

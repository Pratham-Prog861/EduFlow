import { Id } from "@/convex/_generated/dataModel";

/**
 * EDUFLOW USER IDENTITY
 * Core profile data for students and instructors.
 */

export type UserRole = "student" | "instructor" | "admin";

export interface UserProfile {
  _id: Id<"users">;
  _creationTime: number;
  name?: string;
  email?: string;
  externalId: string;
  role: UserRole;
}

export interface UserStats {
  enrolledCourses: number;
  completedLectures: number;
  certificatesEarned: number;
  engagementScore: number;
}

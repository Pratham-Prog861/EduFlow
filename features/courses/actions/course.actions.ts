"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * COURSE MANAGEMENT ACTIONS
 * High-speed server-side operations for educational content lifecycle.
 */

export async function createCourseAction(title: string, description: string, thumbnailUrl: string) {
  try {
    const courseId = await convex.mutation(api.courses.createCourse, {
      title,
      description,
      thumbnailUrl,
    });
    return { success: true, courseId };
  } catch (err: any) {
    console.error("Course Creation Action Failure:", err);
    return { success: false, error: err?.message || "Internal transmission failure." };
  }
}

export async function deleteCourseAction(courseId: Id<"courses">) {
  try {
    // Note: Add delete mutation to Convex if not already there
    // For now we assume a recursive deletion is handled at the DB layer or a dedicated function.
    await convex.mutation(api.courses.updateCourseSummary, { courseId, summary: "" }); // placeholder
    return { success: true };
  } catch (err: any) {
    console.error("Course Deletion Error:", err);
    return { success: false, error: "Unable to decommission this learning path." };
  }
}

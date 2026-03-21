import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

export const getEnrollmentsByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getEnrolledCourses = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) return [];

    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const courseIds = enrollments.map((e) => e.courseId);
    const courses = await Promise.all(courseIds.map((id) => ctx.db.get(id)));

    return courses.filter((c) => c !== null);
  },
});

export const checkEnrollment = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) return false;

    const enrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("courseId"), args.courseId))
      .unique();

    return !!enrollment;
  },
});


export const getEnrollmentCountByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();

    return enrollments.length;
  },
});
export const getEnrollmentCountsByCourses = query({
  args: { courseIds: v.array(v.id("courses")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return {} as Record<string, number>;

    const instructor = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!instructor || instructor.role !== "instructor") {
      return {} as Record<string, number>;
    }

    const instructorCourses = await ctx.db
      .query("courses")
      .withIndex("by_instructorId", (q) => q.eq("instructorId", instructor._id))
      .collect();

    const ownedCourseIds = new Set(instructorCourses.map((course) => String(course._id)));
    const scopedCourseIds = args.courseIds.filter((courseId) =>
      ownedCourseIds.has(String(courseId)),
    );

    const counts: Record<string, number> = {};
    for (const courseId of scopedCourseIds) {
      const enrollments = await ctx.db
        .query("enrollments")
        .withIndex("by_course", (q) => q.eq("courseId", courseId))
        .collect();
      counts[String(courseId)] = enrollments.length;
    }

    return counts;
  },
});

export const enroll = mutation({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    const existing = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("courseId"), args.courseId))
      .unique();

    if (existing) return;

    return await ctx.db.insert("enrollments", {
      userId: user._id,
      courseId: args.courseId,
    });
  },
});

export const getInstructorStudents = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const instructor = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!instructor) return [];

    const instructorCourses = await ctx.db
      .query("courses")
      .withIndex("by_instructorId", (q) => q.eq("instructorId", instructor._id))
      .collect();

    if (instructorCourses.length === 0) return [];

    const courseById = new Map<Id<"courses">, Doc<"courses">>(
      instructorCourses.map((course) => [course._id, course]),
    );

    const studentMap = new Map<
      string,
      {
        userId: Id<"users">;
        courseIds: Set<Id<"courses">>;
      }
    >();

    for (const course of instructorCourses) {
      const enrollments = await ctx.db
        .query("enrollments")
        .withIndex("by_course", (q) => q.eq("courseId", course._id))
        .collect();

      for (const enrollment of enrollments) {
        const key = String(enrollment.userId);
        let studentEntry = studentMap.get(key);

        if (!studentEntry) {
          studentEntry = {
            userId: enrollment.userId,
            courseIds: new Set<Id<"courses">>(),
          };
          studentMap.set(key, studentEntry);
        }

        studentEntry.courseIds.add(enrollment.courseId);
      }
    }

    const students = [];

    for (const item of studentMap.values()) {
      const user = await ctx.db.get(item.userId);
      if (!user) continue;

      const courses = Array.from(item.courseIds)
        .map((courseId) => courseById.get(courseId))
        .filter((course): course is Doc<"courses"> => course !== undefined)
        .map((course) => ({
          _id: course._id,
          title: course.title,
        }));

      students.push({
        _id: user._id,
        name: user.name ?? "Student",
        email: user.email ?? "",
        role: user.role,
        enrolledCourseCount: courses.length,
        courses,
      });
    }

    students.sort((a, b) => b.enrolledCourseCount - a.enrolledCourseCount);

    return students;
  },
});




import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createCourse = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    thumbnailUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user || user.role !== "instructor") {
      throw new Error("Only instructors can create courses");
    }

    const courseId = await ctx.db.insert("courses", {
      title: args.title,
      description: args.description,
      thumbnailUrl: args.thumbnailUrl,
      instructorId: user._id,
      isPublished: false,
    });

    return courseId;
  },
});

export const getPublishedCourses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();
  },
});

export const updateCourseSummary = mutation({
  args: {
    courseId: v.id("courses"),
    summary: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.courseId, {
      aiSummary: args.summary,
    });
  },
});

export const setCoursePublished = mutation({
  args: {
    courseId: v.id("courses"),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user || user.role !== "instructor") {
      throw new Error("Only instructors can publish courses");
    }

    const course = await ctx.db.get(args.courseId);
    if (!course) throw new Error("Course not found");
    if (course.instructorId !== user._id) {
      throw new Error("You can only manage your own courses");
    }

    if (args.published) {
      const lectures = await ctx.db
        .query("lectures")
        .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
        .collect();

      if (lectures.length === 0) {
        throw new Error("Add at least one lecture before publishing.");
      }

      const hasVideo = lectures.some((lecture) => !!lecture.videoUrl);
      if (!hasVideo) {
        throw new Error("Upload at least one lecture video before publishing.");
      }
    }

    await ctx.db.patch(args.courseId, { isPublished: args.published });
    return args.courseId;
  },
});

export const getInstructorCourses = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) {
      return [];
    }

    return await ctx.db
      .query("courses")
      .withIndex("by_instructorId", (q) => q.eq("instructorId", user._id))
      .collect();
  },
});


export const getCoursesForStudents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();
  },
});
export const getCourseById = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.courseId);
  },
});



import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getSectionsByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sections")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();
  },
});

export const createSection = mutation({
  args: {
    courseId: v.id("courses"),
    title: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const course = await ctx.db.get(args.courseId);
    if (!course) throw new Error("Course not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user || user._id !== course.instructorId) {
      throw new Error("Only the instructor of this course can add sections");
    }

    return await ctx.db.insert("sections", {
      courseId: args.courseId,
      title: args.title,
      order: args.order,
    });
  },
});

export const updateSection = mutation({
  args: {
    id: v.id("sections"),
    title: v.optional(v.string()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const deleteSection = mutation({
  args: { id: v.id("sections") },
  handler: async (ctx, args) => {
    // Also delete associated lectures
    const lectures = await ctx.db
      .query("lectures")
      .withIndex("by_section", (q) => q.eq("sectionId", args.id))
      .collect();

    for (const lecture of lectures) {
      await ctx.db.delete(lecture._id);
    }

    await ctx.db.delete(args.id);
  },
});

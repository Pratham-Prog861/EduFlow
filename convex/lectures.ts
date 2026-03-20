import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getLectureById = query({
  args: { id: v.id("lectures") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getLecturesBySection = query({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lectures")
      .withIndex("by_section", (q) => q.eq("sectionId", args.sectionId))
      .collect();
  },
});

export const getLecturesByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lectures")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();
  },
});

export const createLecture = mutation({
  args: {
    sectionId: v.id("sections"),
    courseId: v.id("courses"),
    title: v.string(),
    videoUrl: v.string(),
    isPreview: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const section = await ctx.db.get(args.sectionId);
    if (!section) throw new Error("Section not found");

    return await ctx.db.insert("lectures", {
      sectionId: args.sectionId,
      courseId: args.courseId,
      title: args.title,
      videoUrl: args.videoUrl,
      isPreview: args.isPreview,
      order: args.order,
    });
  },
});

export const updateLecture = mutation({
  args: {
    id: v.id("lectures"),
    title: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    isPreview: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const deleteLecture = mutation({
  args: { id: v.id("lectures") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

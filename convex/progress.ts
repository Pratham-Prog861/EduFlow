import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { MutationCtx, mutation, query } from "./_generated/server";

type ProgressMutationResult = {
  certificateIssued: boolean;
  certificateId: Id<"certificates"> | null;
  certificateCode: string | null;
};

async function upsertProgressAndIssue(
  ctx: MutationCtx,
  args: {
    courseId: Id<"courses">;
    lectureId: Id<"lectures">;
    isCompleted: boolean;
  },
): Promise<ProgressMutationResult> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  const user = await ctx.db
    .query("users")
    .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
    .unique();

  if (!user) throw new Error("User not found");

  const existing = await ctx.db
    .query("progress")
    .withIndex("by_user_lecture", (q) => q.eq("userId", user._id).eq("lectureId", args.lectureId))
    .unique();

  if (existing) {
    await ctx.db.patch(existing._id, { completed: args.isCompleted });
  } else {
    await ctx.db.insert("progress", {
      userId: user._id,
      courseId: args.courseId,
      lectureId: args.lectureId,
      completed: args.isCompleted,
    });
  }

  if (!args.isCompleted) {
    return {
      certificateIssued: false,
      certificateId: null,
      certificateCode: null,
    };
  }

  const issuance: {
    issued: boolean;
    certificateId?: Id<"certificates">;
    certificateCode?: string;
  } = await ctx.runMutation(internal.certificates.issueIfEligibleInternal, {
    courseId: args.courseId,
    userId: user._id,
  });

  return {
    certificateIssued: issuance.issued,
    certificateId: issuance.certificateId ?? null,
    certificateCode: issuance.certificateCode ?? null,
  };
}

export const getProgressByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) return [];

    return await ctx.db
      .query("progress")
      .withIndex("by_user_course", (q) => q.eq("userId", user._id).eq("courseId", args.courseId))
      .collect();
  },
});

export const getLectureProgress = query({
  args: { lectureId: v.id("lectures") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) return false;

    const progress = await ctx.db
      .query("progress")
      .withIndex("by_user_lecture", (q) => q.eq("userId", user._id).eq("lectureId", args.lectureId))
      .unique();

    return progress?.completed || false;
  },
});

export const toggleProgress = mutation({
  args: {
    courseId: v.id("courses"),
    lectureId: v.id("lectures"),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args): Promise<ProgressMutationResult> => {
    return await upsertProgressAndIssue(ctx, args);
  },
});

export const markAsComplete = mutation({
  args: {
    courseId: v.id("courses"),
    lectureId: v.id("lectures"),
    completed: v.boolean(),
  },
  handler: async (ctx, args): Promise<ProgressMutationResult> => {
    return await upsertProgressAndIssue(ctx, {
      courseId: args.courseId,
      lectureId: args.lectureId,
      isCompleted: args.completed,
    });
  },
});

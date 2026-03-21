import { v } from "convex/values";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { internalMutation, MutationCtx, query, QueryCtx } from "./_generated/server";

async function getCurrentUserId(ctx: QueryCtx): Promise<Id<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const user = await ctx.db
    .query("users")
    .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
    .unique();

  return user?._id ?? null;
}

async function generateUniqueCertificateCode(ctx: MutationCtx): Promise<string> {
  for (let i = 0; i < 20; i += 1) {
    const candidate = String(Math.floor(1000000 + Math.random() * 9000000));
    const existing = await ctx.db
      .query("certificates")
      .withIndex("by_code", (q) => q.eq("certificateCode", candidate))
      .first();

    if (!existing) return candidate;
  }

  return String(Date.now()).slice(-7).padStart(7, "0");
}

export const issueIfEligibleInternal = internalMutation({
  args: {
    courseId: v.id("courses"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("certificates")
      .withIndex("by_user_course", (q) => q.eq("userId", args.userId).eq("courseId", args.courseId))
      .first();

    if (existing) {
      return {
        issued: false,
        certificateId: existing._id,
        certificateCode: existing.certificateCode,
      };
    }

    const enrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("courseId"), args.courseId))
      .first();

    if (!enrollment) {
      return { issued: false as const };
    }

    const course = await ctx.db.get(args.courseId);
    if (!course) {
      return { issued: false as const };
    }

    const lectures = await ctx.db
      .query("lectures")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();

    if (lectures.length === 0) {
      return { issued: false as const };
    }

    const progressRows = await ctx.db
      .query("progress")
      .withIndex("by_user_course", (q) => q.eq("userId", args.userId).eq("courseId", args.courseId))
      .collect();

    const completedCount = progressRows.filter((row: Doc<"progress">) => row.completed).length;
    if (completedCount < lectures.length) {
      return { issued: false as const };
    }

    const user = await ctx.db.get(args.userId);
    const instructor = await ctx.db.get(course.instructorId);

    if (!user || !instructor) {
      return { issued: false as const };
    }

    const completedAt = Date.now();
    const certificateCode = await generateUniqueCertificateCode(ctx);
    const certificateId = await ctx.db.insert("certificates", {
      userId: args.userId,
      courseId: args.courseId,
      instructorId: course.instructorId,
      studentName: user.name?.trim() || "Student",
      courseName: course.title,
      instructorName: instructor.name?.trim() || "Instructor",
      completedAt,
      certificateCode,
      issuedAt: completedAt,
      status: "active",
    });

    await ctx.runMutation(api.notifications.createCertificateIssuedNotification, {
      userId: args.userId,
      certificateId,
      courseName: course.title,
    });

    return {
      issued: true,
      certificateId,
      certificateCode,
    };
  },
});

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return [];

    const certificates = await ctx.db
      .query("certificates")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return certificates.sort((a, b) => b.issuedAt - a.issuedAt);
  },
});

export const getByCourse = query({
  args: {
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return null;

    const certificate = await ctx.db
      .query("certificates")
      .withIndex("by_user_course", (q) => q.eq("userId", userId).eq("courseId", args.courseId))
      .first();

    return certificate ?? null;
  },
});

export const getById = query({
  args: {
    certificateId: v.id("certificates"),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return null;

    const certificate = await ctx.db.get(args.certificateId);
    if (!certificate || certificate.userId !== userId) {
      return null;
    }

    const enrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("courseId"), certificate.courseId))
      .first();

    if (!enrollment) {
      return null;
    }

    return certificate;
  },
});

export const getDownloadPayload = query({
  args: {
    certificateId: v.id("certificates"),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{
    _id: Id<"certificates">;
    studentName: string;
    courseName: string;
    instructorName: string;
    completedAt: number;
    certificateCode: string;
    issuedAt: number;
  } | null> => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return null;

    const certificate = await ctx.db.get(args.certificateId);
    if (!certificate || certificate.userId !== userId) {
      return null;
    }

    const enrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("courseId"), certificate.courseId))
      .first();

    if (!enrollment) {
      return null;
    }

    return {
      _id: certificate._id,
      studentName: certificate.studentName,
      courseName: certificate.courseName,
      instructorName: certificate.instructorName,
      completedAt: certificate.completedAt,
      certificateCode: certificate.certificateCode,
      issuedAt: certificate.issuedAt,
    };
  },
});

export const verifyByCode = query({
  args: {
    certificateCode: v.string(),
  },
  handler: async (ctx, args) => {
    const certificate = await ctx.db
      .query("certificates")
      .withIndex("by_code", (q) => q.eq("certificateCode", args.certificateCode))
      .first();

    if (!certificate || certificate.status !== "active") {
      return null;
    }

    return {
      certificateCode: certificate.certificateCode,
      studentName: certificate.studentName,
      courseName: certificate.courseName,
      instructorName: certificate.instructorName,
      completedAt: certificate.completedAt,
      issuedAt: certificate.issuedAt,
      status: certificate.status,
    };
  },
});
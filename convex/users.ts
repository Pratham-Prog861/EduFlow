import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const syncUser = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    externalId: v.string(),
    role: v.optional(v.union(v.literal("student"), v.literal("instructor"))),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .unique();

    const resolvedRole =
      existingUser?.role === "instructor"
        ? "instructor"
        : (args.role ?? "student");

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        name: args.name,
        email: args.email,
        role: resolvedRole,
      });
      return existingUser._id;
    }

    return await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      externalId: args.externalId,
      role: resolvedRole,
    });
  },
});

export const setCurrentUserRole = mutation({
  args: {
    role: v.union(v.literal("student"), v.literal("instructor")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!existingUser) {
      throw new Error("User not found in Convex. Please sign in again.");
    }

    await ctx.db.patch(existingUser._id, {
      role: args.role,
    });

    return existingUser._id;
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();
  },
});

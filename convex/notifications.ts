import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query, QueryCtx } from "./_generated/server";

async function getCurrentUserId(ctx: QueryCtx): Promise<Id<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const user = await ctx.db
    .query("users")
    .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
    .unique();

  return user?._id ?? null;
}

export const createCertificateIssuedNotification = mutation({
  args: {
    userId: v.id("users"),
    certificateId: v.id("certificates"),
    courseName: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      userId: args.userId,
      type: "certificate_issued",
      title: "Certificate unlocked",
      message: `You earned a certificate for ${args.courseName}.`,
      entityId: args.certificateId,
      isRead: false,
      createdAt: Date.now(),
    });
  },
});

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return [];

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return notifications.sort((a, b) => b.createdAt - a.createdAt).slice(0, 20);
  },
});

export const unreadCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserId(ctx);
    if (!userId) return 0;

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return notifications.filter((n) => !n.isRead).length;
  },
});

export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const user = await ctx.db
      .query("users")
      .withIndex("by_externalId", (q) => q.eq("externalId", identity.subject))
      .unique();

    if (!user) return 0;

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const unread = notifications.filter((notification) => !notification.isRead);

    await Promise.all(
      unread.map((notification) =>
        ctx.db.patch(notification._id, {
          isRead: true,
        }),
      ),
    );

    return unread.length;
  },
});

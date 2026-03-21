import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    externalId: v.string(),
    role: v.union(v.literal("student"), v.literal("instructor")),
  }).index("by_externalId", ["externalId"]),

  courses: defineTable({
    title: v.string(),
    description: v.string(),
    thumbnailUrl: v.string(),
    instructorId: v.id("users"),
    aiSummary: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  }).index("by_instructorId", ["instructorId"]),

  sections: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    order: v.number(),
  }).index("by_course", ["courseId"]),

  lectures: defineTable({
    sectionId: v.id("sections"),
    courseId: v.id("courses"),
    title: v.string(),
    videoUrl: v.string(),
    isPreview: v.boolean(),
    order: v.number(),
    duration: v.optional(v.number()),
  })
    .index("by_section", ["sectionId"])
    .index("by_course", ["courseId"]),

  enrollments: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
  })
    .index("by_user", ["userId"])
    .index("by_course", ["courseId"]),

  progress: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    lectureId: v.id("lectures"),
    completed: v.boolean(),
  })
    .index("by_user_lecture", ["userId", "lectureId"])
    .index("by_user_course", ["userId", "courseId"]),

  certificates: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    instructorId: v.id("users"),
    studentName: v.string(),
    courseName: v.string(),
    instructorName: v.string(),
    completedAt: v.number(),
    certificateCode: v.string(),
    issuedAt: v.number(),
    status: v.union(v.literal("active")),
  })
    .index("by_user", ["userId"])
    .index("by_user_course", ["userId", "courseId"])
    .index("by_code", ["certificateCode"])
    .index("by_user_issuedAt", ["userId", "issuedAt"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.union(v.literal("certificate_issued")),
    title: v.string(),
    message: v.string(),
    entityId: v.optional(v.id("certificates")),
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_createdAt", ["userId", "createdAt"]),
});

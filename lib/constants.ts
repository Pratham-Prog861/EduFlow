/**
 * EDUFLOW SYSTEM CONSTANTS
 * Technical configuration and low-level system parameters.
 */

export const SYSTEM_ROLES = {
  STUDENT: "student",
  INSTRUCTOR: "instructor",
  ADMIN: "admin",
} as const;

export const API_TIMEOUTS = {
  GEMINI_SYNTHESIS: 30000, // 30 seconds
  CONVEX_SYNC: 5000, // 5 seconds
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: "eduflow_token",
  USER_PREFERENCES: "eduflow_prefs",
  LAST_LECTURE_ID: (courseId: string) => `last_lecture_${courseId}`,
};

export const FILE_CONSTRAINTS = {
  MAX_VIDEO_SIZE_MB: 500,
  MAX_THUMBNAIL_SIZE_MB: 10,
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/webm", "video/quicktime"],
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
};

export const CACHE_TTL = {
  PUBLIC_COURSES: 3600, // 1 hour
  USER_PROFILE: 300, // 5 minutes
};

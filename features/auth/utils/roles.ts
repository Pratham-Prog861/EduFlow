import { UserRole } from "@/types/user";

/**
 * EDUFLOW ROLE ACCESS UTILS
 * Standardized permission logic for checking identity tiers.
 */

export const RoleConfig = {
  instructor: {
    canCreateCourses: true,
    canManageCurriculum: true,
    canAccessDashboard: true,
    label: "ARCHITECT",
  },
  student: {
    canCreateCourses: false,
    canManageCurriculum: false,
    canAccessDashboard: true,
    label: "LEARNER",
  },
  admin: {
    canCreateCourses: true,
    canManageCurriculum: true,
    canAccessDashboard: true,
    label: "SYSTEM_ROOT",
  }
};

export function hasPermission(role: UserRole, permission: keyof typeof RoleConfig.instructor) {
  return RoleConfig[role]?.[permission] || false;
}

export function isInstructor(role: UserRole) {
  return role === "instructor" || role === "admin";
}

export function isStudent(role: UserRole) {
  return role === "student";
}

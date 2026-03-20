"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

/**
 * useRole Hook
 * Effortlessly determines the user's operational clearance within the EduFlow system.
 * Returns the role and loading state from the unified identity server.
 */
export function useRole() {
  const { user, isLoaded: clerkLoaded } = useUser();
  const dbUser = useQuery(api.users.getCurrentUser, clerkLoaded && user ? {} : "skip");

  const isLoading = !clerkLoaded || (clerkLoaded && user && dbUser === undefined);
  const role = dbUser?.role || "student"; // Default to student
  const isInstructor = role === "instructor";
  const isStudent = role === "student";

  return {
    role,
    isInstructor,
    isStudent,
    isLoading,
    dbUser
  };
}

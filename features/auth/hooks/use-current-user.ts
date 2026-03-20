"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { UserProfile } from "@/types/user";
import { isInstructor, isStudent } from "../utils/roles";

/**
 * useCurrentUser Hook
 * Comprehensive identity and role telemetry for the current user.
 * Merges Clerk and Convex data into a single, unified interface.
 */
export function useCurrentUser() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useClerkUser();
  const dbUser = useQuery(api.users.getCurrentUser, clerkLoaded && clerkUser ? {} : "skip");

  // Loading if Clerk isn't ready, or if Clerk is ready and user is signed in, but Convex hasn't returned yet.
  const isLoading = !clerkLoaded || (clerkUser && dbUser === undefined);
  const isAuthenticated = clerkLoaded && !!clerkUser;
  
  const user = dbUser as UserProfile | null;
  const role = user?.role || "student";

  return {
    user,
    role,
    isAuthenticated,
    isLoading,
    isInstructor: isAuthenticated && isInstructor(role),
    isStudent: isAuthenticated && isStudent(role),
    externalId: clerkUser?.id,
    metadata: {
        lastSignIn: clerkUser?.lastSignInAt,
        primaryEmail: clerkUser?.primaryEmailAddress?.emailAddress,
    }
  };
}

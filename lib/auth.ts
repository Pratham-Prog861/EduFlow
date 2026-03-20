import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * Server-Side Role Recognition
 * Authenticates the current session and performs an internal role check via Convex.
 */
export async function getSessionRole() {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    const user = await convex.query(api.users.getCurrentUser, {});
    return user?.role || "student";
  } catch (err) {
    console.error("Session Role Recognition Error:", err);
    return "student";
  }
}

/**
 * Is System Instructor
 * Boolean check for server-side route guards.
 */
export async function isSystemInstructor() {
  const role = await getSessionRole();
  return role === "instructor";
}

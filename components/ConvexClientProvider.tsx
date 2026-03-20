"use client";

import { ReactNode, useEffect, useMemo, useRef } from "react";
import { ConvexReactClient, useMutation } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth, useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

type SupportedRole = "student" | "instructor";

function resolveRole(value: unknown): SupportedRole | undefined {
  if (value === "instructor") return "instructor";
  if (value === "student") return "student";
  return undefined;
}

function ClerkUserSync() {
  const { isLoaded, isSignedIn, user } = useUser();
  const syncUser = useMutation(api.users.syncUser);
  const lastSyncKey = useRef<string | null>(null);

  const payload = useMemo(() => {
    if (!isLoaded || !isSignedIn || !user) return null;

    const role = resolveRole(
      (user.publicMetadata as { role?: unknown } | undefined)?.role ??
        (user.unsafeMetadata as { role?: unknown } | undefined)?.role,
    );

    const email = user.primaryEmailAddress?.emailAddress;

    return {
      externalId: user.id,
      name: user.fullName ?? undefined,
      email,
      role,
    };
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (!payload) {
      lastSyncKey.current = null;
      return;
    }

    const nextKey = `${payload.externalId}:${payload.name ?? ""}:${payload.email ?? ""}:${payload.role ?? "none"}`;
    if (lastSyncKey.current === nextKey) return;

    let cancelled = false;

    (async () => {
      try {
        await syncUser(payload);
        if (!cancelled) {
          lastSyncKey.current = nextKey;
        }
      } catch (error) {
        console.error("Failed to sync Clerk user to Convex:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [payload, syncUser]);

  return null;
}

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <ClerkUserSync />
      {children}
    </ConvexProviderWithClerk>
  );
}

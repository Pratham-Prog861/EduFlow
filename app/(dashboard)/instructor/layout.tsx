"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function InstructorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = useQuery(api.users.getCurrentUser);
  const setCurrentUserRole = useMutation(api.users.setCurrentUserRole);

  useEffect(() => {
    if (user === undefined || user === null) return;
    if (user.role === "instructor") return;

    void setCurrentUserRole({ role: "instructor" });
  }, [user, setCurrentUserRole]);

  return <>{children}</>;
}

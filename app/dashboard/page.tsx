"use client";

import { useEffect } from "react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardIndexPage() {
  const router = useRouter();
  const user = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    if (user === undefined) return;

    const target = user?.role === "instructor" ? "/instructor" : "/student";
    router.replace(target);
  }, [router, user]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md space-y-3">
        <Skeleton className="h-4 w-2/3 mx-auto" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

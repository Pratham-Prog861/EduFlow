"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useQuery(api.users.getCurrentUser);

  if (user === undefined) {
    return (
      <div className="flex h-screen w-full bg-slate-50/70 dark:bg-slate-950">
        <div className="fixed inset-y-0 z-40 hidden w-72 border-r border-slate-200/70 md:flex">
          <div className="w-full p-6">
            <Skeleton className="mb-6 h-7 w-36" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>

        <main className="w-full md:pl-72">
          <div className="h-16 border-b border-slate-200/70 px-6">
            <div className="flex h-full items-center justify-end">
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
          <div className="p-8">
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

  const role = (user?.role as "student" | "instructor") || "student";

  return (
    <div className="min-h-screen bg-transparent">
      <div className="fixed inset-x-0 top-0 z-50 h-16 px-2 py-1 md:px-3">
        <Navbar />
      </div>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 pt-[4.25rem] md:block">
        <Sidebar role={role} className="h-full rounded-r-3xl" />
      </aside>

      <main className="pt-[4.6rem] md:pl-72">
        <div className="premium-shell py-6">
          <div className="premium-surface min-h-[calc(100vh-7.5rem)] rounded-3xl p-5 md:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

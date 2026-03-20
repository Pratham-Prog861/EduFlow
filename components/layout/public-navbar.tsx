"use client";

import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { GraduationCap, Sparkles, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";

export function PublicNavbar() {
  const pathname = usePathname();
  const user = useQuery(api.users.getCurrentUser);
  const dashboardHref = user?.role === "instructor" ? "/dashboard/instructor" : "/dashboard/student";

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-200/70 bg-white/75 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/70">
      <div className="premium-shell flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-900 p-2 text-white shadow-lg shadow-slate-900/20 dark:bg-white dark:text-slate-950">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">eduFlow</p>
            <p className="text-xs text-slate-400">AI Learning Platform</p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className={cn(
              "text-sm font-semibold transition-colors",
              pathname === "/" ? "text-slate-950 dark:text-white" : "text-slate-500 hover:text-slate-950 dark:hover:text-white",
            )}
          >
            Home
          </Link>
          <Link
            href="/courses"
            className={cn(
              "text-sm font-semibold transition-colors",
              pathname.startsWith("/courses") ? "text-slate-950 dark:text-white" : "text-slate-500 hover:text-slate-950 dark:hover:text-white",
            )}
          >
            Courses
          </Link>
          <Link
            href="/dashboard/instructor"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Teach on eduFlow
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Authenticated>
            <Link href={dashboardHref}>
              <Button variant="outline" className="h-9 rounded-full px-4 text-xs font-semibold uppercase tracking-[0.14em]">
                <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" />
                Dashboard
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </Authenticated>

          <Unauthenticated>
            <Link
              href="/sign-up"
              className="hidden rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 sm:inline-flex"
            >
              Instructor Sign Up
            </Link>
            <SignInButton mode="modal">
              <Button className="h-9 rounded-full bg-slate-900 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950">
                Login
              </Button>
            </SignInButton>
          </Unauthenticated>
        </div>
      </div>
    </nav>
  );
}

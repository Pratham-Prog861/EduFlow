"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { GraduationCap, Menu, Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sidebar } from "./sidebar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function Navbar() {
  const user = useQuery(api.users.getCurrentUser);
  const role = (user?.role as "student" | "instructor") || "student";
  const dashboardHref = role === "instructor" ? "/dashboard/instructor" : "/dashboard/student";
  const instructorHref = "/dashboard/instructor/courses/create";

  return (
    <nav className="premium-surface h-16 border-b border-slate-200/70 px-4 md:px-6">
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger
              render={
                <Button variant="ghost" size="icon" className="rounded-full md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />
            <DialogContent className="fixed left-0 top-0 h-screen w-72 translate-x-0 rounded-none border-none p-0">
              <DialogTitle className="sr-only">Mobile Navigation</DialogTitle>
              <DialogDescription className="sr-only">Dashboard navigation menu</DialogDescription>
              <Sidebar role={role} className="h-full" />
            </DialogContent>
          </Dialog>

          <Link href={dashboardHref} className="flex items-center gap-2">
            <div className="rounded-lg bg-slate-900 p-2 text-white dark:bg-white dark:text-slate-950">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div className="leading-none">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">eduFlow</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Dashboard</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href={instructorHref}>
            <Button variant="outline" className="hidden h-9 rounded-full px-4 text-xs font-semibold uppercase tracking-[0.14em] md:inline-flex">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Publish Course
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-600" />
          </Button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
}

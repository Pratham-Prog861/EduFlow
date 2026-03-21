"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { GraduationCap, Menu, Bell, Sparkles, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sidebar } from "./sidebar";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

export function Navbar() {
  const user = useQuery(api.users.getCurrentUser);
  const notifications = useQuery(api.notifications.listMine);
  const unreadCount = useQuery(api.notifications.unreadCount);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

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

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="relative rounded-full">
                  <Bell className="h-4.5 w-4.5" />
                  {(unreadCount ?? 0) > 0 ? (
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-600" />
                  ) : null}
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                {(unreadCount ?? 0) > 0 ? (
                  <button
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                    onClick={() => void markAllAsRead({})}
                  >
                    Mark all read
                  </button>
                ) : null}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {!notifications || notifications.length === 0 ? (
                <DropdownMenuItem className="py-3 text-sm text-slate-500">
                  No notifications yet.
                </DropdownMenuItem>
              ) : (
                notifications.slice(0, 6).map((notification) => (
                  <DropdownMenuItem key={notification._id} className="py-3">
                    <Link
                      href={
                        notification.type === "certificate_issued" && notification.entityId
                          ? `/dashboard/student/certificates/${notification.entityId}`
                          : "/dashboard/student"
                      }
                      className="flex w-full items-start gap-3"
                    >
                      <span className="mt-0.5 rounded-full bg-amber-100 p-1.5 text-amber-700">
                        <Award className="h-3.5 w-3.5" />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold text-slate-900">{notification.title}</span>
                        <span className="block text-xs text-slate-600">{notification.message}</span>
                        <span className="mt-1 block text-[11px] text-slate-400">{formatTime(notification.createdAt)}</span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
}

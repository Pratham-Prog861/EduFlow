"use client";

import type { HTMLAttributes } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Settings,
  PlusCircle,
  Library,
  Users,
  Award,
} from "lucide-react";

interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  role: "student" | "instructor";
}

export function Sidebar({ role, className }: SidebarProps) {
  const pathname = usePathname();

  const studentRoutes = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/student" },
    { label: "My Courses", icon: Library, href: "/dashboard/student/courses" },
    { label: "Certificates", icon: Award, href: "/dashboard/student/certificates" },
    { label: "Browse Courses", icon: BookOpen, href: "/courses" },
  ];

  const instructorRoutes = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard/instructor" },
    { label: "My Courses", icon: GraduationCap, href: "/dashboard/instructor/courses" },
    { label: "Create Course", icon: PlusCircle, href: "/dashboard/instructor/courses/create" },
    { label: "Students", icon: Users, href: "/dashboard/instructor/students" },
  ];

  const routes = role === "instructor" ? instructorRoutes : studentRoutes;

  const isActive = (href: string) =>
    href === "/courses"
      ? pathname.startsWith("/courses")
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r border-slate-200/70 bg-white/75 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70",
        className,
      )}
    >
      <div className="px-5 pb-5 pt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          {role === "instructor" ? "Instructor Console" : "Learning Workspace"}
        </p>
      </div>

      <div className="flex-1 space-y-1 px-3">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition",
              isActive(route.href)
                ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950"
                : "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white",
            )}
          >
            <route.icon className="h-4.5 w-4.5" />
            {route.label}
          </Link>
        ))}
      </div>

      <div className="border-t border-slate-200/70 p-3 dark:border-slate-800/80">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white",
            pathname.startsWith("/dashboard/settings") && "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white",
          )}
        >
          <Settings className="h-4.5 w-4.5" />
          Settings
        </Link>
      </div>
    </div>
  );
}

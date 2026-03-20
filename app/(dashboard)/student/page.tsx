"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { GraduationCap, BookOpen, TrendingUp, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EnrolledCourseCard } from "@/components/course/course-card";
import { EnrolledCourseSkeleton } from "@/components/common/skeletons";

export default function StudentDashboard() {
  const enrolledCourses = useQuery(api.enrollments.getEnrolledCourses);

  const stats = [
    { label: "Courses Enrolled", value: enrolledCourses?.length || 0, icon: BookOpen },
    { label: "Completed Lessons", value: "0", icon: CheckCircle2 },
    { label: "Study Hours", value: "0", icon: Clock },
    { label: "Active Courses", value: enrolledCourses?.filter(Boolean).length || 0, icon: TrendingUp },
  ];

  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-eyebrow">Student Dashboard</p>
          <h1 className="mt-2 text-4xl text-slate-900 dark:text-white">Continue your learning journey</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Jump back into your enrolled courses and track progress.</p>
        </div>

        <Link href="/dashboard/student/courses">
          <Button className="h-10 rounded-full bg-slate-900 px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950">
            Explore Courses
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-2xl border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-950/70">
            <CardContent className="p-5">
              <div className="inline-flex rounded-lg bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <stat.icon className="h-4.5 w-4.5" />
              </div>
              <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-slate-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl text-slate-900 dark:text-white">My Courses</h2>
          <Link href="/dashboard/student/courses" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300">
            View all
          </Link>
        </div>

        {!enrolledCourses ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <EnrolledCourseSkeleton key={n} />
            ))}
          </div>
        ) : enrolledCourses.length === 0 ? (
          <Card className="rounded-3xl border-dashed border-slate-300 bg-white/80 p-10 text-center dark:border-slate-700 dark:bg-slate-950/70">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-slate-100 p-4 dark:bg-slate-800">
              <GraduationCap className="h-7 w-7 text-slate-700 dark:text-slate-200" />
            </div>
            <h3 className="text-2xl text-slate-900 dark:text-white">No active enrollments</h3>
            <p className="mx-auto mt-2 max-w-md text-slate-600 dark:text-slate-300">
              You have not enrolled in a course yet. Start with the catalog and build your path.
            </p>
            <Link href="/dashboard/student/courses" className="mt-6 inline-flex">
              <Button className="h-10 rounded-full bg-slate-900 px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950">
                Browse Catalog
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {enrolledCourses.map((course) => (
              <EnrolledCourseCard key={course?._id} course={course as Doc<"courses">} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

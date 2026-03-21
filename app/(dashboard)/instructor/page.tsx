"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Doc } from "@/convex/_generated/dataModel";
import {
  GraduationCap,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function InstructorDashboard() {
  const user = useQuery(api.users.getCurrentUser);
  const courses = useQuery(api.courses.getInstructorCourses);
  const students = useQuery(api.enrollments.getInstructorStudents);

  const courseIds = courses?.map((course) => course._id) ?? [];
  const enrollmentCounts = useQuery(
    api.enrollments.getEnrollmentCountsByCourses,
    courses ? { courseIds } : "skip",
  );

  const stats = useMemo(() => {
    const activeCourses = courses?.length ?? 0;
    const totalStudents = students?.length ?? 0;
    const totalEnrollments = Object.values(enrollmentCounts ?? {}).reduce(
      (sum, count) => sum + count,
      0,
    );

    return {
      activeCourses,
      totalStudents,
      totalEnrollments,
      estimatedRevenue: totalEnrollments * 0,
    };
  }, [courses, students, enrollmentCounts]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(" ")[0] || "Instructor"}!
          </h1>
          <p className="text-slate-500 mt-2">
            Manage your academy and track student performance.
          </p>
        </div>
        <Link href="/dashboard/instructor/courses/create">
          <Button className="rounded-full px-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 h-11">
            <Plus className="w-5 h-5 mr-2" />
            Create New Course
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<GraduationCap className="w-5 h-5 text-indigo-600" />}
          title="Active Courses"
          value={String(stats.activeCourses)}
          trend="Live"
        />
        <StatCard
          icon={<Users className="w-5 h-5 text-violet-600" />}
          title="Total Students"
          value={String(stats.totalStudents)}
          trend="Live"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-fuchsia-600" />}
          title="Course Enrolls"
          value={String(stats.totalEnrollments)}
          trend="Live"
        />
        <StatCard
          icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
          title="Est. Revenue"
          value={`$${stats.estimatedRevenue}`}
          trend="Live"
        />
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold">Recent Courses</h2>
          <Link
            href="/dashboard/instructor/courses"
            className="text-indigo-600 text-sm font-medium hover:underline"
          >
            View all
          </Link>
        </div>
        {!courses ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        ) : courses.length === 0 ? (
          <div className="aspect-video bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 text-sm">No courses published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 3).map((course: Doc<"courses">) => {
              const studentCount = enrollmentCounts?.[String(course._id)] ?? 0;
              const studentLabel = studentCount === 1 ? "Student" : "Students";

              return (
                <div
                  key={course._id}
                  className="group p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center gap-4 transition-all hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={course.thumbnailUrl}
                      alt={course.title}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-950 dark:text-white truncate">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                      {studentCount} {studentLabel}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  trend,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend?: string;
}) {
  return (
    <Card className="rounded-3xl border-none bg-white dark:bg-slate-950 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl">
          {icon}
        </div>
        {trend ? (
          <div className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-full">
            {trend}
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight mt-2">{value}</div>
        <p className="text-sm font-medium text-slate-400 mt-1">{title}</p>
      </CardContent>
    </Card>
  );
}


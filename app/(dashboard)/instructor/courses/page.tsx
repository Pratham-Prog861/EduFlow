"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { Plus, GraduationCap, Edit, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { InstructorCourseSkeleton } from "@/components/common/skeletons";

export default function InstructorCoursesPage() {
  const courses = useQuery(api.courses.getInstructorCourses);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Your Academy</h1>
          <p className="text-slate-500 mt-1">
            Create, edit, and publish your educational content.
          </p>
        </div>
        <Link href="/dashboard/instructor/courses/create">
          <Button className="rounded-full px-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 h-11 transition-all active:scale-95">
            <Plus className="w-5 h-5 mr-2" />
            Create New Course
          </Button>
        </Link>
      </div>

      {!courses ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <InstructorCourseSkeleton key={n} />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] p-24 text-center border-none shadow-sm flex flex-col items-center justify-center">
          <div className="bg-indigo-50 dark:bg-indigo-950/40 p-6 rounded-2xl mb-6 shadow-xs animate-pulse">
            <GraduationCap className="w-12 h-12 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Your Academy is Empty</h2>
          <p className="max-w-md text-slate-500 mt-4 leading-relaxed">
            Start with one course, add sections and videos, and publish when ready.
          </p>
          <Link href="/dashboard/instructor/courses/create" className="mt-8">
            <Button className="rounded-full px-10 h-14 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/25 text-lg font-bold transition-all hover:scale-105 active:scale-95">
              Launch Your First Course
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

function CourseCard({ course }: { course: Doc<"courses"> }) {
  const enrollmentCount = useQuery(api.enrollments.getEnrollmentCountByCourse, {
    courseId: course._id,
  });

  return (
    <Card className="rounded-[2rem] border-none shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white dark:bg-slate-950 group h-full flex flex-col">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={course.thumbnailUrl}
          alt={course.title}
          width={500}
          height={500}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Badge className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-md rounded-full shadow-lg border-none hover:bg-white dark:hover:bg-slate-900 px-3 py-1">
          {course.isPublished ? "Published" : "Draft"}
        </Badge>
        <Link
          href={`/dashboard/instructor/courses/${course._id}/content`}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Button
            variant="secondary"
            className="rounded-full bg-white text-indigo-600 font-bold shadow-xl"
          >
            Manage Content <BookOpen className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>

      <CardHeader className="p-6">
        <CardTitle className="text-xl font-bold tracking-tight group-hover:text-indigo-600 transition-colors">
          {course.title}
        </CardTitle>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed h-10">
          {course.description}
        </p>
      </CardHeader>

      <div className="mt-auto px-6 pb-6 pt-2">
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 tracking-wider">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> {enrollmentCount ?? 0} STUDENTS
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <Edit className="w-3.5 h-3.5" />
            LAST EDITED JUST NOW
          </div>
        </div>
      </div>
    </Card>
  );
}

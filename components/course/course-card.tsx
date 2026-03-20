"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, GraduationCap } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function EnrolledCourseCard({ course }: { course: Doc<"courses"> }) {
  const lectures = useQuery(api.lectures.getLecturesByCourse, {
    courseId: course._id,
  });
  const progress = useQuery(api.progress.getProgressByCourse, {
    courseId: course._id,
  });

  const totalLectures = lectures?.length ?? 0;
  const completedLectures = progress?.filter((p) => p.completed).length ?? 0;
  const isCompleted = totalLectures > 0 && completedLectures >= totalLectures;

  return (
    <Link href={`/dashboard/student/courses/${course._id}`}>
      <Card className="h-full overflow-hidden rounded-3xl border-slate-200/80 bg-white/95 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/80">
        <div className="relative aspect-video">
          <Image
            src={course.thumbnailUrl || "/course-placeholder.jpg"}
            alt={course.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <Badge className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
              {isCompleted ? "Completed" : "Continue"}
            </Badge>
          </div>
        </div>

        <CardContent className="space-y-4 p-5">
          <h3 className="line-clamp-1 text-lg font-semibold text-slate-900 dark:text-white">
            {course.title}
          </h3>
          <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
            {course.description}
          </p>
          <div className="flex items-center justify-between border-t border-slate-200/70 pt-4 text-xs uppercase tracking-[0.16em] text-slate-500 dark:border-slate-800">
            <span>{isCompleted ? "Completed" : "In Progress"}</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function BrowseCard({ course }: { course: Doc<"courses"> }) {
  return (
    <Link href={`/dashboard/student/courses/${course._id}`} className="block h-full">
      <Card className="h-full overflow-hidden rounded-3xl border-slate-200/80 bg-white/95 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/80">
        <div className="relative aspect-video">
          <Image
            src={course.thumbnailUrl || "/course-placeholder.jpg"}
            alt={course.title}
            fill
            className="object-cover"
          />
        </div>

        <CardContent className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em]"
            >
              Best Seller
            </Badge>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3.5 w-3.5" /> 12h
            </span>
          </div>

          <h3 className="line-clamp-2 text-xl font-semibold text-slate-900 dark:text-white">
            {course.title}
          </h3>
          <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
            {course.description}
          </p>

          <div className="flex items-center justify-between border-t border-slate-200/70 pt-4 dark:border-slate-800">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
              <GraduationCap className="h-4 w-4" /> Free course
            </span>
            <Button className="h-9 rounded-full bg-slate-900 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950">
              Enroll
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

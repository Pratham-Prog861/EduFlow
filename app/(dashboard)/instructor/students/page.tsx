"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, BookOpen } from "lucide-react";

export default function InstructorStudentsPage() {
  const students = useQuery(api.enrollments.getInstructorStudents);

  const totalStudents = students?.length ?? 0;
  const totalEnrollments =
    students?.reduce((sum, student) => sum + student.enrolledCourseCount, 0) ?? 0;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-eyebrow">Instructor</p>
        <h1 className="text-4xl text-slate-900 dark:text-white">Your Students</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Track learners enrolled in your courses.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-2xl border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-950/70">
          <CardContent className="p-6">
            <div className="inline-flex rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
              <Users className="h-4.5 w-4.5 text-slate-700 dark:text-slate-200" />
            </div>
            <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
              {totalStudents}
            </p>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
              Total Students
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-950/70">
          <CardContent className="p-6">
            <div className="inline-flex rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
              <BookOpen className="h-4.5 w-4.5 text-slate-700 dark:text-slate-200" />
            </div>
            <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
              {totalEnrollments}
            </p>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
              Course Enrollments
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-950/70">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900 dark:text-white">
            Student List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!students ? (
            <p className="text-sm text-slate-500">Loading students...</p>
          ) : students.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-300">
                No students yet. Once learners enroll in your courses, they will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student._id}
                  className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/40"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {student.name}
                      </h3>
                      <p className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
                        <Mail className="h-3.5 w-3.5" />
                        {student.email || "No email available"}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="w-fit rounded-full px-3 py-1 text-xs uppercase tracking-[0.14em]"
                    >
                      {student.enrolledCourseCount} courses
                    </Badge>
                  </div>

                  {student.courses.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {student.courses.map((course) => (
                        <span
                          key={course._id}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {course.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

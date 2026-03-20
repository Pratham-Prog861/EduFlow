"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, Sparkles, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BrowseCard } from "@/components/course/course-card";
import { BrowseCardSkeleton } from "@/components/common/skeletons";
import { Course } from "@/types/course";

export default function PublicCoursesPage() {
  const [search, setSearch] = useState("");
  const courses = useQuery(api.courses.getPublishedCourses);

  const filteredCourses = useMemo(() => {
    if (!courses) return undefined;

    return courses.filter((course: Course) => {
      const query = search.toLowerCase();
      return (
        course.title.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query)
      );
    });
  }, [courses, search]);

  return (
    <div className="premium-shell space-y-10 pb-20 pt-24 md:pt-28">
      <section className="premium-surface rounded-[2rem] p-6 md:p-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-4">
            <Badge variant="outline" className="w-fit rounded-full border-slate-300 bg-white px-4 py-1 text-[10px] tracking-[0.2em] text-slate-600 dark:bg-slate-900">
              <Sparkles className="mr-1.5 h-3 w-3" />
              Course Marketplace
            </Badge>
            <h1 className="text-4xl text-slate-900 dark:text-white md:text-5xl">Find the right course for your next skill leap.</h1>
            <p className="text-slate-600 dark:text-slate-300">Explore practical, high-quality courses built by instructors using EduFlow.</p>
          </div>

          <div className="w-full max-w-md space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search courses"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 rounded-full border-slate-200 bg-white pl-10 dark:border-slate-700 dark:bg-slate-900"
              />
            </div>
            <Button variant="outline" className="h-9 rounded-full text-xs font-semibold uppercase tracking-[0.14em]">
              <Filter className="mr-1.5 h-3.5 w-3.5" />
              Curated selection
            </Button>
          </div>
        </div>
      </section>

      <section>
        {!filteredCourses ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <BrowseCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="premium-surface rounded-3xl p-12 text-center">
            <h2 className="text-2xl text-slate-900 dark:text-white">No courses matched your search.</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Try another keyword or view the full catalog.</p>
            <Link href="/courses" onClick={() => setSearch("")}>
              <Button className="mt-5 rounded-full bg-slate-900 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950">
                Reset Search
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {filteredCourses.map((course) => (
              <BrowseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>

      <section className="premium-surface rounded-3xl p-8 md:p-12">
        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-eyebrow">For Instructors</p>
            <h3 className="mt-2 text-3xl text-slate-900 dark:text-white">Publish your first course with EduFlow</h3>
            <p className="mt-1 text-slate-600 dark:text-slate-300">Use the instructor dashboard to create, organize, and launch your course catalog.</p>
          </div>
          <Link href="/dashboard/instructor/courses/create">
            <Button className="rounded-full bg-slate-900 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950">
              Open Instructor Studio
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

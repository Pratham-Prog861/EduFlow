"use client";

import type { ReactNode } from "react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  Brain,
  PlayCircle,
  LineChart,
} from "lucide-react";
import { api } from "@/convex/_generated/api";

export default function LandingPage() {
  const user = useQuery(api.users.getCurrentUser);
  const dashboardHref =
    user?.role === "instructor" ? "/dashboard/instructor" : "/dashboard/student";

  return (
    <div className="grow pb-20">
      <section className="premium-shell pt-24 md:pt-28">
        <div className="premium-surface rounded-[2rem] p-6 md:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-7">
              <Badge
                variant="outline"
                className="w-fit rounded-full border-slate-300 bg-white px-4 py-1 text-[10px] tracking-[0.2em] text-slate-600 dark:bg-slate-900"
              >
                <Sparkles className="mr-1.5 h-3 w-3" />
                AI-Powered LMS
              </Badge>

              <div className="space-y-4">
                <h1 className="text-4xl leading-[1.04] text-slate-900 dark:text-white md:text-6xl">
                  Premium learning for students.
                  <br />
                  Built for modern instructors.
                </h1>
                <p className="max-w-xl text-base text-slate-600 dark:text-slate-300 md:text-lg">
                  Create courses, publish fast, and guide learners with a seamless
                  AI-assisted classroom experience.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Unauthenticated>
                  <SignInButton mode="modal">
                    <Button className="h-11 rounded-full bg-slate-900 px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950">
                      Start Learning
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </SignInButton>
                </Unauthenticated>

                <Authenticated>
                  <Link href={dashboardHref}>
                    <Button className="h-11 rounded-full bg-slate-900 px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950">
                      Go to Dashboard
                    </Button>
                  </Link>
                </Authenticated>

                <Link href="/courses">
                  <Button
                    variant="outline"
                    className="h-11 rounded-full px-6 text-xs font-semibold uppercase tracking-[0.16em]"
                  >
                    Explore Courses
                  </Button>
                </Link>

                <Link href="/dashboard/instructor">
                  <Button
                    variant="ghost"
                    className="h-11 rounded-full px-6 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600"
                  >
                    Teach on eduFlow
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureTile
                icon={<GraduationCap className="h-5 w-5" />}
                title="Instructor Studio"
                description="Create, structure, and launch courses with polished workflows."
              />
              <FeatureTile
                icon={<Brain className="h-5 w-5" />}
                title="AI Summaries"
                description="Generate clear summaries to improve lesson comprehension."
              />
              <FeatureTile
                icon={<PlayCircle className="h-5 w-5" />}
                title="Smooth Learning"
                description="Focused lesson player with progress tracking and flow."
              />
              <FeatureTile
                icon={<LineChart className="h-5 w-5" />}
                title="Growth Insights"
                description="Understand outcomes and optimize course performance."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="premium-shell mt-12">
        <div className="grid gap-4 md:grid-cols-3">
          <Kpi value="10k+" label="Students" />
          <Kpi value="500+" label="Courses" />
          <Kpi value="99%" label="Course Satisfaction" />
        </div>
      </section>
    </div>
  );
}

function FeatureTile({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-3 inline-flex rounded-lg bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </article>
  );
}

function Kpi({ value, label }: { value: string; label: string }) {
  return (
    <div className="premium-surface rounded-2xl p-6 text-center">
      <p className="text-3xl font-semibold text-slate-900 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
    </div>
  );
}

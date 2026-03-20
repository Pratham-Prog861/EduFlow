"use client";

import { GraduationCap, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/80 py-16 dark:border-slate-800/80 dark:bg-slate-950/70">
      <div className="premium-shell space-y-12">
        <div className="premium-surface rounded-3xl p-6 md:p-10">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-900 p-2 text-white dark:bg-white dark:text-slate-950">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">eduFlow</span>
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Build, launch, and scale premium learning experiences.</h3>
              <p className="max-w-2xl text-slate-600 dark:text-slate-300">
                EduFlow helps instructors publish modern courses and gives students a focused, seamless learning journey.
              </p>
              <div className="flex flex-wrap gap-5 text-sm text-slate-600 dark:text-slate-300">
                <FooterLink href="/courses" label="Browse Courses" />
                <FooterLink href="/dashboard/instructor" label="Instructor Dashboard" />
                <FooterLink href="/sign-up" label="Become an Instructor" />
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-eyebrow">Weekly Insights</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">Get product updates and instructor growth tips.</p>
              <div className="flex items-center gap-2">
                <Input placeholder="Your email" className="h-10 rounded-full border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900" />
                <Button size="icon" className="h-10 w-10 rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>(c) 2026 EduFlow. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-slate-900 dark:hover:text-white">Privacy</Link>
            <Link href="#" className="hover:text-slate-900 dark:hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 font-medium text-slate-700 transition hover:text-slate-950 dark:text-slate-200 dark:hover:text-white">
      {label}
      <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  );
}
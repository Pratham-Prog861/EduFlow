"use client";

import { useEffect, useState, type ReactNode } from "react";
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
  BookOpen,
  ShieldCheck,
  WandSparkles,
  Clock3,
  Users,
  CheckCircle2,
  Rocket,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Quote,
} from "lucide-react";
import { api } from "@/convex/_generated/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const testimonials = [
  {
    quote:
      "eduFlow helped us launch 6 cohort courses in 2 months with less ops overhead.",
    name: "Ananya Mehta",
    role: "Head of Programs, SkillForge",
  },
  {
    quote:
      "The learning flow is smooth, and completion rates improved after moving to eduFlow.",
    name: "Rahul Sharma",
    role: "Senior Instructor, DevSprint",
  },
  {
    quote:
      "Students love the clean player and AI summaries. Support tickets dropped significantly.",
    name: "Nidhi Verma",
    role: "L&D Lead, TalentGrid",
  },
];

const faqs = [
  {
    id: "faq-1",
    question: "Can instructors upload their own videos and thumbnails?",
    answer:
      "Yes. Instructors can upload course thumbnails and lecture videos from their device using the built-in upload flows.",
  },
  {
    id: "faq-2",
    question: "How does publishing work?",
    answer:
      "A course can be published once it has at least one lecture with a video. You can also unpublish anytime from course content settings.",
  },
  {
    id: "faq-3",
    question: "Can students track completion per course?",
    answer:
      "Yes. Progress is tracked at lecture level, and course cards reflect in-progress vs completed status automatically.",
  },
  {
    id: "faq-4",
    question: "Is role-based access supported for students and instructors?",
    answer:
      "Yes. eduFlow supports separate student and instructor experiences with dedicated dashboards and workflows.",
  },
];

export default function LandingPage() {
  const user = useQuery(api.users.getCurrentUser);
  const dashboardHref =
    user?.role === "instructor" ? "/dashboard/instructor" : "/dashboard/student";
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const items = Array.from(document.querySelectorAll(".reveal-on-scroll"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    items.forEach((el, index) => {
      (el as HTMLElement).style.transitionDelay = `${index * 90}ms`;
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grow pb-20">
      <section className="premium-shell pt-24 md:pt-28 reveal-on-scroll">
        <div className="premium-surface rounded-[2rem] p-6 md:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-7">
              <Badge
                variant="outline"
                className="w-fit rounded-full border-slate-300 bg-white px-4 py-1 text-[10px] tracking-[0.2em] text-slate-600 dark:bg-slate-900"
              >
                <Sparkles className="mr-1.5 h-3 w-3" />
                AI-Powered LMS Platform
              </Badge>

              <div className="space-y-4">
                <h1 className="text-4xl leading-[1.02] text-slate-900 dark:text-white md:text-6xl">
                  Build courses. Teach smarter.
                  <br />
                  Learn faster on eduFlow.
                </h1>
                <p className="max-w-xl text-base text-slate-600 dark:text-slate-300 md:text-lg">
                  One platform for modern instructors and focused learners. Create,
                  publish, track progress, and deliver premium learning experiences.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Unauthenticated>
                  <SignInButton mode="modal">
                    <Button className="h-11 rounded-full bg-slate-900 px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950">
                      Get Started
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

              <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
                <MiniMetric value="10k+" label="Learners" />
                <MiniMetric value="500+" label="Courses" />
                <MiniMetric value="94%" label="Completion" />
                <MiniMetric value="24/7" label="Access" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureTile
                icon={<GraduationCap className="h-5 w-5" />}
                title="Instructor Studio"
                description="Create, structure, and launch courses with clean workflows."
              />
              <FeatureTile
                icon={<Brain className="h-5 w-5" />}
                title="AI Summaries"
                description="Generate concise explanations and revision notes instantly."
              />
              <FeatureTile
                icon={<PlayCircle className="h-5 w-5" />}
                title="Learning Player"
                description="Distraction-free lessons with progress tracking and checkpoints."
              />
              <FeatureTile
                icon={<LineChart className="h-5 w-5" />}
                title="Outcomes Analytics"
                description="Understand engagement, completion, and learner performance."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="premium-shell mt-12 reveal-on-scroll">
        <div className="grid gap-4 md:grid-cols-3">
          <Kpi value="10k+" label="Students" />
          <Kpi value="500+" label="Courses" />
          <Kpi value="99%" label="Course Satisfaction" />
        </div>
      </section>

      <section className="premium-shell mt-12 reveal-on-scroll">
        <div className="grid gap-5 lg:grid-cols-2">
          <PersonaCard
            eyebrow="For Students"
            title="Learn with clarity and momentum"
            description="Browse published courses, enroll in one click, track lecture progress, and finish with confidence."
            points={[
              "Personal dashboard and enrolled library",
              "Lecture-wise completion tracking",
              "AI summaries for faster revision",
            ]}
            href="/student/courses"
            action="Start Learning"
            icon={<BookOpen className="h-5 w-5" />}
          />
          <PersonaCard
            eyebrow="For Instructors"
            title="Create and publish premium courses"
            description="Upload thumbnails and videos, organize sections, manage students, and publish only when your course is ready."
            points={[
              "Instructor workspace with content tools",
              "Student enrollment visibility",
              "Publish workflow with quality checks",
            ]}
            href="/dashboard/instructor"
            action="Open Instructor Dashboard"
            icon={<Rocket className="h-5 w-5" />}
          />
        </div>
      </section>

      <section className="premium-shell mt-12 reveal-on-scroll">
        <div className="premium-surface rounded-3xl p-6 md:p-10">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-eyebrow">Why eduFlow</p>
              <h2 className="mt-1 text-3xl text-slate-900 dark:text-white md:text-4xl">
                Built for quality learning outcomes
              </h2>
            </div>
            <p className="max-w-xl text-sm text-slate-600 dark:text-slate-300">
              Every workflow is optimized for clarity, speed, and measurable progress for both learners and instructors.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Benefit icon={<ShieldCheck className="h-5 w-5" />} title="Reliable" text="Secure auth, stable dashboards, and clean role-based flows." />
            <Benefit icon={<Clock3 className="h-5 w-5" />} title="Efficient" text="Create, upload, and publish faster with fewer clicks." />
            <Benefit icon={<WandSparkles className="h-5 w-5" />} title="AI-Enhanced" text="Summaries and smart insights to reduce cognitive load." />
            <Benefit icon={<Users className="h-5 w-5" />} title="Collaborative" text="One platform where instructors and students align." />
            <Benefit icon={<Trophy className="h-5 w-5" />} title="Outcome-Driven" text="Completion-focused design, not vanity metrics." />
            <Benefit icon={<CheckCircle2 className="h-5 w-5" />} title="Production-Ready" text="From onboarding to publishing, fully connected flows." />
          </div>
        </div>
      </section>

      <section className="premium-shell mt-12 reveal-on-scroll">
        <div className="grid gap-5 lg:grid-cols-2">
          <Workflow
            title="Student Journey"
            steps={[
              "Sign in and discover published courses",
              "Enroll instantly and start learning",
              "Track progress until full completion",
              "Review with AI summaries before assessments",
            ]}
          />
          <Workflow
            title="Instructor Journey"
            steps={[
              "Create course with thumbnail and description",
              "Build sections and lectures",
              "Upload lecture videos and verify content",
              "Publish and monitor enrolled students",
            ]}
          />
        </div>
      </section>

      <section className="premium-shell mt-12 reveal-on-scroll">
        <div className="premium-surface rounded-3xl p-8 md:p-10">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-eyebrow">Testimonials</p>
              <h2 className="mt-1 text-3xl text-slate-900 dark:text-white md:text-4xl">
                Teams and creators trust eduFlow
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() =>
                  setActiveTestimonial(
                    (prev) => (prev - 1 + testimonials.length) % testimonials.length,
                  )
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() =>
                  setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white p-6 dark:border-slate-800 dark:bg-slate-950/60">
            <Quote className="h-6 w-6 text-slate-400" />
            <p className="mt-3 text-lg text-slate-800 dark:text-slate-100">
              {testimonials[activeTestimonial].quote}
            </p>
            <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
              {testimonials[activeTestimonial].name}
            </p>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
              {testimonials[activeTestimonial].role}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            {testimonials.map((item, index) => (
              <button
                key={item.name}
                type="button"
                className={`h-2.5 rounded-full transition-all ${
                  index === activeTestimonial
                    ? "w-8 bg-slate-900 dark:bg-white"
                    : "w-2.5 bg-slate-300 dark:bg-slate-700"
                }`}
                onClick={() => setActiveTestimonial(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="premium-shell mt-12 reveal-on-scroll">
        <div className="premium-surface rounded-3xl p-8 md:p-10">
          <p className="text-eyebrow">FAQ</p>
          <h2 className="mt-1 text-3xl text-slate-900 dark:text-white md:text-4xl">
            Frequently asked questions
          </h2>

          <Accordion className="mt-6" defaultValue={[faqs[0].id]}>
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-slate-200/70 dark:border-slate-800">
                <AccordionTrigger className="text-base font-semibold text-slate-900 dark:text-white">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="premium-shell mt-12 reveal-on-scroll">
        <div className="premium-surface rounded-3xl p-8 md:p-12 text-center">
          <p className="text-eyebrow">Start Today</p>
          <h2 className="mt-2 text-3xl text-slate-900 dark:text-white md:text-4xl">
            Ready to launch your AI-powered learning platform?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
            Join as a student to learn, or as an instructor to build and publish your own courses.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/courses">
              <Button className="h-11 rounded-full bg-slate-900 px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950">
                Browse Courses
              </Button>
            </Link>
            <Link href="/dashboard/instructor">
              <Button variant="outline" className="h-11 rounded-full px-6 text-xs font-semibold uppercase tracking-[0.16em]">
                Become an Instructor
              </Button>
            </Link>
          </div>
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
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
    </article>
  );
}

function Kpi({ value, label }: { value: string; label: string }) {
  return (
    <div className="premium-surface rounded-2xl p-6 text-center">
      <p className="text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
    </div>
  );
}

function MiniMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white/70 p-3 text-center dark:border-slate-800 dark:bg-slate-900/50">
      <p className="text-base font-semibold text-slate-900 dark:text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
    </div>
  );
}

function PersonaCard({
  eyebrow,
  title,
  description,
  points,
  href,
  action,
  icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  href: string;
  action: string;
  icon: ReactNode;
}) {
  return (
    <article className="premium-surface rounded-3xl p-6 md:p-8">
      <p className="text-eyebrow">{eyebrow}</p>
      <h3 className="mt-2 text-2xl text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
      <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <Link href={href} className="mt-5 inline-flex">
        <Button className="h-10 rounded-full bg-slate-900 px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950">
          {icon}
          <span className="ml-1.5">{action}</span>
        </Button>
      </Link>
    </article>
  );
}

function Benefit({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60">
      <div className="mb-3 inline-flex rounded-lg bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{text}</p>
    </article>
  );
}

function Workflow({ title, steps }: { title: string; steps: string[] }) {
  return (
    <article className="premium-surface rounded-3xl p-6 md:p-8">
      <h3 className="text-2xl text-slate-900 dark:text-white">{title}</h3>
      <ol className="mt-5 space-y-3">
        {steps.map((step, index) => (
          <li
            key={step}
            className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-white p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200"
          >
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white dark:bg-white dark:text-slate-950">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </article>
  );
}





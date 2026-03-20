"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import {
  GraduationCap,
  BookOpen,
  Clock,
  ArrowRight,
  PlayCircle,
  Video,
  LayoutDashboard,
  Zap,
  Star,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { DetailPageSkeleton } from "@/components/common/skeletons";
import { CourseSummary } from "@/components/ai/course-summary";
import { Section } from "@/types/course";
import { Lecture } from "@/types/lecture";

export default function PublicCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as Id<"courses">;

  const course = useQuery(api.courses.getCourseById, { courseId });
  const sections = useQuery(api.sections.getSectionsByCourse, { courseId });
  const enrollment = useQuery(api.enrollments.checkEnrollment, { courseId });
  const enroll = useMutation(api.enrollments.enroll);

  const onEnroll = async () => {
    try {
      await enroll({ courseId });
      toast.success("Successfully enrolled!");
      router.push(`/dashboard/student/courses/${courseId}`);
    } catch {
      toast.error("Failed to enroll");
    }
  };

  if (!course || !sections) {
    return <DetailPageSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-24 space-y-24 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Info Column */}
        <div className="space-y-12 shrink-0">
          <div className="space-y-8">
            <Badge
              variant="outline"
              className="py-1.5 px-6 rounded-full border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 font-black uppercase tracking-widest text-[10px] shadow-sm flex items-center gap-2 w-fit"
            >
              <Zap className="w-3 h-3" />
              TOP RATED COURSE
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-slate-950 dark:text-white leading-[0.9] uppercase tracking-tight">
              {course.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
              {course.description ||
                "Master these skills with our comprehensive, expert-led course designed for modern learners. From theory to practice, we cover it all."}
            </p>
          </div>

          <div className="flex flex-wrap gap-6 pt-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600/10 p-2 rounded-xl">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  DURATION
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  12.5 HOURS
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-amber-600/10 p-2 rounded-xl">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  RATING
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  4.9 / 5.0
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600/10 p-2 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  ACCESS
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  LIFETIME
                </span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
            <Unauthenticated>
              <SignInButton mode="modal">
                <Button
                  size="lg"
                  className="rounded-full px-12 h-16 font-black uppercase tracking-widest text-[11px] bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-500/10 group"
                >
                  Enroll for Free{" "}
                  <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-all" />
                </Button>
              </SignInButton>
            </Unauthenticated>
            <Authenticated>
              {enrollment ? (
                <Link href={`/dashboard/student/courses/${courseId}`}>
                  <Button
                    size="lg"
                    className="rounded-full px-12 h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-emerald-500/10"
                  >
                    Already Enrolled{" "}
                    <LayoutDashboard className="ml-3 w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={onEnroll}
                  size="lg"
                  className="rounded-full px-12 h-16 bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-indigo-600 transition-all font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-indigo-500/10 group"
                >
                  Start Learning Now{" "}
                  <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-all" />
                </Button>
              )}
            </Authenticated>
          </div>
        </div>

        {/* Media Column */}
        <div className="relative group">
          <div className="absolute inset-0 bg-indigo-600 rounded-[3rem] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-1000" />
          <div className="relative rounded-[3rem] overflow-hidden border-8 border-slate-100 dark:border-slate-900 shadow-3xl">
            {course.thumbnailUrl ? (
              <Image
                src={course.thumbnailUrl}
                alt={course.title}
                width={800}
                height={600}
                className="w-full aspect-4/3 object-cover"
              />
            ) : (
              <div className="w-full aspect-4/3 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                <GraduationCap className="w-24 h-24 text-slate-300" />
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl flex items-center justify-between border border-white/20">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">
                    INSTRUCTOR
                  </span>
                  <span className="text-white font-bold">Expert Academy</span>
                </div>
                <Badge className="bg-white text-slate-950 hover:bg-white border-none font-black uppercase tracking-widest text-[9px]">
                  PREVIEW AVAILABLE
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary Section */}
      <CourseSummary
        courseId={courseId}
        courseTitle={course.title}
        courseDescription={course.description}
        aiSummary={course.aiSummary}
        lectureTitles={[]} // Temporary, would ideally fetch these
      />

      {/* Curriculum Section */}
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Badge
              variant="secondary"
              className="bg-indigo-600 text-white border-none font-black px-4 h-6 text-[9px] tracking-widest uppercase mb-2"
            >
              CURRICULUM
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tight uppercase">
              COURSE STRUCTURE
            </h2>
          </div>
          <div className="flex items-center gap-6 text-sm font-bold text-slate-500">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> {sections.length} MODULES
            </div>
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4" /> MULTIPLE LECTURES
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, idx) => (
            <PublicSectionCard
              key={section._id}
              section={section as Section}
              idx={idx + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PublicSectionCard({
  section,
  idx,
}: {
  section: Section;
  idx: number;
}) {
  const lectures = useQuery(api.lectures.getLecturesBySection, {
    sectionId: section._id,
  });

  return (
    <Card className="rounded-[2.5rem] border-none bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 transition-all duration-500 group shadow-none hover:shadow-2xl hover:shadow-indigo-500/5">
      <CardHeader className="p-8">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-black text-slate-200 dark:text-slate-800 group-hover:text-indigo-600/30 transition-colors">
            {idx < 10 ? `0${idx}` : idx}
          </div>
          <CardTitle className="text-xl font-black text-slate-950 dark:text-white uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
            {section.title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-8 pb-8 space-y-4">
        {lectures?.map((lecture: Lecture) => (
          <div
            key={lecture._id}
            className="flex items-center justify-between group/item py-2"
          >
            <div className="flex items-center gap-3">
              <PlayCircle className="w-4 h-4 text-slate-400 group-hover/item:text-indigo-600 transition-colors" />
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover/item:text-slate-950 dark:group-hover/item:text-white transition-colors">
                {lecture.title}
              </span>
            </div>
            <Badge
              variant="outline"
              className="text-[8px] font-black uppercase tracking-widest border-slate-200 py-0 h-5"
            >
              LECTURE
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}


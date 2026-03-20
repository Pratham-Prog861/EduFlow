"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import {
  ArrowLeft,
  CheckCircle2,
  Menu,
  X,
  PlayCircle,
  Clock,
  ArrowRight,
  Lock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CourseSidebar } from "@/components/player/course-sidebar";

export default function CoursePlayerPage() {
  const params = useParams();
  const courseId = params.courseId as Id<"courses">;
  const lectureId = params.lectureId as Id<"lectures">;
  const router = useRouter();

  const course = useQuery(api.courses.getCourseById, { courseId });
  const sections = useQuery(api.sections.getSectionsByCourse, { courseId });
  const currentLecture = useQuery(api.lectures.getLectureById, { id: lectureId });
  const lecturesByCourse = useQuery(api.lectures.getLecturesByCourse, { courseId });
  
  const isCompleted = useQuery(api.progress.getLectureProgress, { lectureId });
  const toggleProgress = useMutation(api.progress.toggleProgress);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!course || !currentLecture || !sections) {
    return (
      <div className="flex h-screen bg-white dark:bg-slate-950 overflow-hidden">
        <aside className="w-80 h-full border-r border-slate-100 dark:border-slate-800 shrink-0">
          <div className="p-8 space-y-6">
            <Skeleton className="h-8 w-48 rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <div className="space-y-3 pt-8">
              <Skeleton className="h-12 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          </div>
        </aside>
        <div className="flex-1 flex flex-col">
          <header className="h-20 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-8">
             <Skeleton className="h-8 w-64 rounded-full" />
             <Skeleton className="h-10 w-32 rounded-full" />
          </header>
          <div className="p-12 space-y-12 max-w-[1200px] mx-auto w-full">
            <Skeleton className="aspect-video w-full rounded-[2.5rem]" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4 rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-5/6 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const onToggleComplete = async () => {
    try {
      await toggleProgress({
        courseId,
        lectureId,
        isCompleted: !isCompleted,
      });
      toast.success(isCompleted ? "Marked as incomplete" : "Lecture completed!");
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-black overflow-hidden relative">
      {/* Sidebar - Desktop */}
      <div className={cn(
        "bg-slate-50 dark:bg-slate-900/50 border-r border-slate-100 dark:border-slate-800 transition-all duration-500 overflow-y-auto z-30",
        sidebarOpen ? "w-[360px]" : "w-0 p-0 overflow-hidden"
      )}>
        <CourseSidebar 
            course={course} 
            sections={sections} 
            currentLectureId={lectureId} 
            courseId={courseId} 
        />
      </div>

      {/* Main Player Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-20 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-black/80 backdrop-blur-3xl sticky top-0 z-20 flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? <X className="w-5 h-5 text-slate-500" /> : <Menu className="w-5 h-5 text-slate-500" />}
                </Button>
                <div className="hidden md:block">
                   <h2 className="text-sm font-black text-slate-900 dark:text-white truncate max-w-xs">{currentLecture.title}</h2>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{course.title}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <Link href={`/dashboard/student/courses/${courseId}`}>
                    <Button variant="ghost" size="sm" className="rounded-full text-slate-500 hover:text-indigo-600 font-bold">
                       <ArrowLeft className="w-4 h-4 mr-2" /> Exit Player
                    </Button>
                </Link>
                <Button 
                    onClick={onToggleComplete}
                    className={cn(
                      "rounded-full px-6 font-black text-sm h-10 shadow-lg transition-all active:scale-95",
                      isCompleted ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20"
                    )}
                >
                    {isCompleted ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Completed</> : "Mark as Complete"}
                </Button>
            </div>
        </header>

        <main className="flex-1 p-4 md:p-8 lg:p-12 max-w-[1200px] mx-auto w-full space-y-12 pb-24">
            {/* Video Container */}
            <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-500/10 border-8 border-slate-50 dark:border-slate-900 group relative">
                {currentLecture.videoUrl ? (
                    <video 
                        key={currentLecture.videoUrl}
                        src={currentLecture.videoUrl} 
                        className="w-full h-full object-contain" 
                        controls 
                        autoPlay
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-4">
                        <div className="bg-slate-800/50 p-6 rounded-full">
                            <Lock className="w-12 h-12 text-slate-600" />
                        </div>
                        <p className="font-bold text-lg">No video content for this lecture.</p>
                    </div>
                )}
            </div>

            {/* Navigation & Info */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-12">
                <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-indigo-600 text-white border-none font-black px-4 h-6 text-[10px] tracking-widest uppercase mb-2 shadow-lg shadow-indigo-600/20">NOW PLAYING</Badge>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">{currentLecture.title}</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-3xl">
                        {currentLecture.description || "In this lesson, we dive deep into the core concepts covered in this module. Take your time to understand each segment."}
                    </p>
                </div>
            </div>

            {/* Bottom Nav */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-12 flex items-center justify-between">
                <Button variant="outline" className="rounded-full border-2 border-slate-100 dark:border-slate-800 px-8 h-12 font-bold group">
                    <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Previous Lesson
                </Button>
                <Button className="rounded-full bg-slate-900 hover:bg-slate-800 px-8 h-12 font-bold group">
                    Next Lesson <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </main>
      </div>
    </div>
  );
}









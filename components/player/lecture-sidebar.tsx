"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { 
  ChevronRight, 
  ChevronLeft, 
  PlayCircle, 
  CheckCircle2, 
  Lock, 
  Clock, 
  GraduationCap, 
  ArrowRight,
  BookOpen,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CourseProgress } from "@/components/course/course-progress";

interface LectureSidebarProps {
  course: Doc<"courses">;
  sections: Doc<"sections">[];
  currentLectureId: string;
}

export function LectureSidebar({
  course,
  sections,
  currentLectureId
}: LectureSidebarProps) {
  const lectures = useQuery(api.lectures.getLecturesByCourse, { courseId: course._id });
  const progress = useQuery(api.progress.getProgressByCourse, { courseId: course._id });

  const completedCount = progress?.filter(p => p.completed).length || 0;
  const totalLectures = lectures?.length || 0;
  const percentage = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 transition-all duration-500 overflow-hidden relative">
      {/* Glossy Header */}
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
           <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-600/20">
              <GraduationCap className="w-5 h-5 text-white" />
           </div>
           <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">CURRICULUM ARCHIVE</span>
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase leading-tight line-clamp-2 mb-8">{course.title}</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
             <span>Overall Mastery</span>
             <span className="text-indigo-600 font-black">{percentage}%</span>
          </div>
          <CourseProgress value={percentage} variant="premium" size="sm" />
        </div>
      </div>

      {/* Scrollable Curriculum */}
      <div className="flex-1 overflow-y-auto curriculum-scroll pb-24">
         {sections.map((section, idx) => (
           <SidebarSection 
             key={section._id}
             section={section}
             index={idx + 1}
             currentLectureId={currentLectureId}
             courseId={course._id}
           />
         ))}
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-6 left-6 right-6">
         <div className="bg-indigo-600 rounded-3xl p-4 flex items-center justify-between shadow-xl shadow-indigo-500/20 group cursor-pointer transition-transform hover:scale-105 active:scale-95">
            <div className="flex items-center gap-3">
               <div className="bg-white/20 p-2 rounded-xl">
                  <Sparkles className="w-4 h-4 text-white" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase tracking-widest text-indigo-100">AI LEARNING MODE</span>
                  <span className="text-white text-[10px] font-bold">SMART SUMMARIES ACTIVE</span>
               </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
         </div>
      </div>
    </div>
  );
}

function SidebarSection({ section, index, currentLectureId, courseId }: { section: Doc<"sections">, index: number, currentLectureId: string, courseId: string }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const lectures = useQuery(api.lectures.getLecturesBySection, { sectionId: section._id });

    return (
        <div className="border-b border-slate-100/50 dark:border-slate-800/50">
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-6 hover:bg-white dark:hover:bg-slate-800/40 transition-all group"
            >
                <div className="flex items-center gap-4 text-left">
                    <div className="text-xs font-black text-slate-300 dark:text-slate-700 group-hover:text-indigo-600/50 transition-colors uppercase tracking-widest">
                        {index < 10 ? `MODULE 0${index}` : `MODULE ${index}`}
                    </div>
                </div>
                <div className={cn("p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 transition-transform", isExpanded ? "rotate-180" : "rotate-0")}>
                   <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
            </button>

            {isExpanded && (
                <div className="pb-4 pt-0 animate-in slide-in-from-top-4 duration-300">
                    <div className="px-6 mb-4">
                       <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1">{section.title}</h4>
                    </div>
                    {lectures?.map((lecture) => (
                        <SidebarLectureItem 
                            key={lecture._id} 
                            lecture={lecture} 
                            isActive={lecture._id === currentLectureId} 
                            courseId={courseId}
                        />
                    ))}
                    {!lectures && (
                        <div className="px-8 flex flex-col gap-3">
                            <Skeleton className="h-4 w-full rounded-full" />
                            <Skeleton className="h-4 w-3/4 rounded-full" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function SidebarLectureItem({ lecture, isActive, courseId }: { lecture: Doc<"lectures">, isActive: boolean, courseId: string }) {
    const isCompleted = useQuery(api.progress.getLectureProgress, { lectureId: lecture._id });

    return (
        <Link href={`/dashboard/student/courses/${courseId}/learn/${lecture._id}`}>
            <div className={cn(
                "flex items-center gap-4 px-8 py-4 transition-all group relative cursor-pointer mx-2 rounded-2xl",
                isActive ? "bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/50 z-10" : "hover:bg-white/50 dark:hover:bg-slate-800/30"
            )}>
                {isActive && <div className="absolute left-0 inset-y-3 w-1.5 bg-indigo-600 rounded-r-full shadow-[2px_0_10px_rgba(79,70,229,0.5)]" />}
                
                <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-all transform group-hover:scale-110",
                    isCompleted 
                      ? "bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20" 
                      : isActive 
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30" 
                        : "border-slate-200 dark:border-slate-700"
                )}>
                    {isCompleted 
                      ? <CheckCircle2 className="w-4 h-4 text-white" /> 
                      : isActive 
                        ? <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse shadow-sm shadow-indigo-600" />
                        : <PlayCircle className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    }
                </div>

                <div className="flex-1 min-w-0">
                    <span className={cn(
                        "text-[11px] font-black uppercase tracking-tight transition-colors line-clamp-1 leading-tight",
                        isActive ? "text-indigo-600" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-950 dark:group-hover:text-white"
                    )}>
                        {lecture.title}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-slate-300" />
                        <span className="text-[8px] font-black uppercase tracking-[0.1em] text-slate-300 group-hover:text-slate-400 transition-colors">10:00 EST.</span>
                    </div>
                </div>
                
                {!isActive && (
                    <div className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                       <ArrowRight className="w-4 h-4 text-indigo-600" />
                    </div>
                )}
            </div>
        </Link>
    );
}


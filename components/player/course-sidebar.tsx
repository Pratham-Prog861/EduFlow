"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { 
  CheckCircle2, 
  PlayCircle, 
  ChevronRight, 
  ChevronLeft,
  GraduationCap,
  Clock,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CourseSidebarProps {
  course: Doc<"courses">;
  sections: Doc<"sections">[];
  currentLectureId: string;
  courseId: Id<"courses">;
}

export function CourseSidebar({ course, sections, currentLectureId, courseId }: CourseSidebarProps) {
    const lectures = useQuery(api.lectures.getLecturesByCourse, { courseId });
    const progress = useQuery(api.progress.getProgressByCourse, { courseId });
    
    const completedCount = progress?.filter(p => p.completed).length || 0;
    const totalLectures = lectures?.length || 0;
    const percentage = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 shadow-xl relative z-30">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-indigo-600 p-2 rounded-xl">
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Course Content</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight line-clamp-2">{course.title}</h3>
                
                {/* Progress bar */}
                <div className="mt-8 space-y-2">
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                        <span>Course Completion</span>
                        <span className="text-indigo-600 font-black">{percentage}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-indigo-600 transition-all duration-1000 ease-out" 
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-12 custom-scrollbar">
                {sections.map((section, idx) => (
                    <SidebarSection 
                        key={section._id} 
                        section={section} 
                        index={idx + 1} 
                        currentLectureId={currentLectureId} 
                        courseId={courseId}
                    />
                ))}
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
                className="w-full flex items-center justify-between p-6 hover:bg-white dark:hover:bg-slate-800/50 transition-colors group"
            >
                <div className="flex items-center gap-4 text-left">
                    <div className="text-sm font-black text-slate-300 dark:text-slate-700 group-hover:text-indigo-600/50 transition-colors">
                        {index < 10 ? `0${index}` : index}
                    </div>
                    <span className="font-black text-sm text-slate-900 dark:text-slate-200 uppercase tracking-widest group-hover:text-indigo-600 transition-colors duration-300">
                        {section.title}
                    </span>
                </div>
                {isExpanded ? <ChevronLeft className="w-4 h-4 text-slate-400 -rotate-90 transition-transform" /> : <ChevronRight className="w-4 h-4 text-slate-400 transition-transform" />}
            </button>

            {isExpanded && (
                <div className="pb-4">
                    {lectures?.map((lecture) => (
                        <SidebarLectureItem 
                            key={lecture._id} 
                            lecture={lecture} 
                            isActive={lecture._id === currentLectureId} 
                            courseId={courseId}
                        />
                    ))}
                    {!lectures && (
                        <div className="px-6 py-2">
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
                "flex items-center gap-4 px-8 py-4 transition-all group relative cursor-pointer",
                isActive ? "bg-white dark:bg-slate-800 shadow-sm z-10" : "hover:bg-white/50 dark:hover:bg-slate-800/20"
            )}>
                {isActive && <div className="absolute left-0 inset-y-0 w-1.5 bg-indigo-600 rounded-r-full" />}
                
                <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors",
                    isCompleted 
                      ? "bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20" 
                      : isActive 
                        ? "border-indigo-600" 
                        : "border-slate-200 dark:border-slate-700"
                )}>
                    {isCompleted 
                      ? <CheckCircle2 className="w-4 h-4 text-white" /> 
                      : isActive 
                        ? <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                        : <PlayCircle className="w-3 h-3 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    }
                </div>

                <div className="flex-1 min-w-0">
                    <span className={cn(
                        "text-xs font-bold transition-colors line-clamp-1",
                        isActive ? "text-indigo-600" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                    )}>
                        {lecture.title}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-slate-300" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">10:00</span>
                    </div>
                </div>
                
                {!isActive && (
                    <ArrowRight className="w-3 h-3 text-slate-200 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                )}
            </div>
        </Link>
    );
}


"use client";

import type { ReactNode } from "react";

import { useInstructorCourses } from "../hooks/use-instructor-courses";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Plus, 
  Settings, 
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  Brain,
  Video
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InstructorCourseSkeleton } from "@/components/common/skeletons";
import Link from "next/link";
import { EmptyState } from "@/components/common/empty-state";

/**
 * INSTRUCTOR HUB (MAESTRO DASHBOARD)
 * The definitive command center for educational content architects.
 * Orchestrates curriculum oversight and institutional performance.
 */
export function InstructorDashboard() {
  const { courses, isLoading, isEmpty, count } = useInstructorCourses();

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      {/* Dynamic Command Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="space-y-4">
           <Badge className="bg-indigo-600/10 text-indigo-600 border-none font-black uppercase tracking-[0.2em] text-[10px] w-fit">INSTRUCTOR COMMENCE</Badge>
           <h1 className="text-5xl font-black text-slate-950 dark:text-white uppercase tracking-tight leading-[0.9]">ARCHITECT <br /> DASHBOARD</h1>
           <p className="text-slate-500 font-medium max-w-lg">Manage your knowledge clusters, analyze student trajectories, and deploy new educational pathways.</p>
        </div>

        <Link href="/dashboard/instructor/courses/create">
          <Button className="rounded-full px-10 h-16 bg-slate-950 hover:bg-indigo-600 text-white dark:bg-white dark:text-slate-950 font-black uppercase tracking-widest text-xs h-10 shadow-3xl shadow-slate-950/20 active:scale-95 transition-all group shrink-0">
             <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
             New Course Stream
          </Button>
        </Link>
      </div>

      {/* Institutional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <StatsCard 
           icon={<BookOpen className="w-5 h-5 text-indigo-600" />} 
           label="ARCHIVED PATHS" 
           value={count.toString()} 
           subText="TOTAL COURSES"
         />
         <StatsCard 
           icon={<Users className="w-5 h-5 text-emerald-500" />} 
           label="STUDENT NODES" 
           value="1,280" 
           subText="ENROLLED LEARNERS"
           trend="+12%"
         />
         <StatsCard 
           icon={<Brain className="w-5 h-5 text-violet-600" />} 
           label="AI SYNTHESIS" 
           value="42" 
           subText="INSIGHTS GENERATED"
         />
         <StatsCard 
           icon={<TrendingUp className="w-5 h-5 text-amber-500" />} 
           label="ACADEMIC YIELD" 
           value="$4,500" 
           subText="PROJECTED REVENUE"
           trend="+8%"
         />
      </div>

      {/* Curriculum Management Section */}
      <div className="space-y-10 mb-24">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-8">
           <div className="flex items-center gap-6">
              <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-600/20">
                 <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tight">ACTIVE ARCHIVES</h3>
           </div>
           <Link href="/dashboard/instructor/courses" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2">
              Deep View All <ChevronRight className="w-3 h-3" />
           </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <InstructorCourseSkeleton key={i} />
            ))}
          </div>
        ) : isEmpty ? (
          <EmptyState 
            title="Archives Empty" 
            description="You have not yet initialized any knowledge streams. Begin your legacy as an educator today."
            actionLabel="COMMENCE CREATION"
            actionHref="/dashboard/instructor/courses/create"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {courses.map((course) => (
               <DashboardCourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatsCard({ icon, label, value, subText, trend }: { icon: ReactNode; label: string; value: string; subText: string; trend?: string }) {
  return (
    <div className="bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-900 group shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] rounded-full group-hover:bg-indigo-500/10 transition-colors -translate-y-1/2 translate-x-1/2" />
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl group-hover:rotate-6 transition-transform">
           {icon}
        </div>
        {trend && (
           <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[10px] uppercase">{trend}</Badge>
        )}
      </div>
      <div className="space-y-1 relative z-10">
         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</span>
         <h2 className="text-4xl font-black text-slate-950 dark:text-white uppercase tracking-tight">{value}</h2>
         <p className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">{subText}</p>
      </div>
    </div>
  );
}

function DashboardCourseCard({ course }: { course: { _id: string; title: string; thumbnailUrl?: string } }) {
  return (
    <Link href={`/dashboard/instructor/courses/${course._id}`}>
       <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] overflow-hidden group border border-slate-100 dark:border-slate-900 shadow-sm hover:shadow-2xl transition-all duration-700">
         <div className="aspect-video relative overflow-hidden">
            <img 
               src={course.thumbnailUrl || "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop"} 
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
               alt={course.title}
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
               <Badge className="bg-white text-slate-950 font-black uppercase px-4 h-6 text-[9px] tracking-widest border-none">MANAGE ASSET</Badge>
            </div>
         </div>
         <div className="p-8 space-y-4">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">STATUS: ACTIVE</span>
            </div>
            <h4 className="text-xl font-black text-slate-950 dark:text-white uppercase tracking-tight line-clamp-1 leading-tight group-hover:text-indigo-600 transition-colors">{course.title}</h4>
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-slate-400">
                  <Video className="w-3.5 h-3.5" /> 24 Modules
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-slate-400">
                  <Users className="w-3.5 h-3.5" /> 42 Nodes
               </div>
            </div>
         </div>
       </div>
    </Link>
  );
}



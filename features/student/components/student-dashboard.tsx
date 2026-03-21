"use client";

import type { ReactNode } from "react";

import { useEnrolledCourses } from "../hooks/use-enrolled-courses";
import { 
  Trophy, 
  Clock, 
  Sparkles, 
  Play, 
  BadgeCheck,
  Search,
  BookOpen,
  LayoutDashboard,
  Brain
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BrowseCardSkeleton } from "@/components/common/skeletons";
import Link from "next/link";
import { EmptyState } from "@/components/common/empty-state";
import { BrowseCard } from "@/components/course/browse-card";

/**
 * STUDENT LEARNING PORTAL
 * The definitive home for the modern educator.
 * Orchestrates knowledge retention and trajectory tracking.
 */
export function StudentDashboard() {
  const { courses, isLoading, isEmpty, count } = useEnrolledCourses();

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
      {/* Personalized Welcome Shield */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <Badge className="bg-indigo-600/10 text-indigo-600 border-none font-black uppercase tracking-[0.2em] text-[10px] w-fit">STUDENT PORTAL</Badge>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black uppercase tracking-[0.2em] text-[10px] w-fit flex items-center gap-1.5 px-3 h-6">
                <Sparkles className="w-3 h-3" /> ACTIVE PROGRESS
              </Badge>
           </div>
           <h1 className="text-5xl font-black text-slate-930 dark:text-white uppercase tracking-tight leading-[0.9]">KNOWLEDGE <br /> TRAJECTORY</h1>
           <p className="text-slate-500 font-bold max-w-lg">Welcome back. Continue your path toward institutional mastery through your subscribed course archives.</p>
        </div>

        <Link href="/courses">
           <Button className="rounded-full px-10 h-16 bg-slate-950 hover:bg-slate-900 dark:bg-white dark:text-slate-950 text-white font-black uppercase tracking-widest text-xs h-10 shadow-3xl shadow-slate-950/20 active:scale-95 transition-all group shrink-0">
             <Search className="w-4 h-4 mr-2" /> Explore Catalog
           </Button>
        </Link>
      </div>

      {/* Trajectory Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         <SummaryCard 
           icon={<BookOpen className="w-5 h-5 text-indigo-600" />} 
           label="ARCHIVED PATHS" 
           value={count.toString()} 
           subText="AUTHORIZED COURSES"
         />
         <SummaryCard 
           icon={<BadgeCheck className="w-5 h-5 text-emerald-500" />} 
           label="MASTERY NODES" 
           value="12" 
           subText="LECTURES COMPLETED"
         />
         <SummaryCard 
           icon={<Clock className="w-5 h-5 text-violet-600" />} 
           label="STUDY VELOCITY" 
           value="42h" 
           subText="KNOWLEDGE UPTAKE"
         />
         <SummaryCard 
           icon={<Trophy className="w-5 h-5 text-amber-500" />} 
           label="ACADEMIC RANK" 
           value="TOP 8%" 
           subText="MAESTRO STANDING"
           trend="ASCENDING"
         />
      </div>

      {/* Persistent Knowledge Grid */}
      <div className="space-y-10 mb-24">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-8">
           <div className="flex items-center gap-6">
              <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-600/20">
                 <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tight">ACTIVE CURRICULUM</h3>
           </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <BrowseCardSkeleton key={i} />
            ))}
          </div>
        ) : isEmpty ? (
          <EmptyState 
            title="Curriculum Empty" 
            description="You are not yet tracking any knowledge paths. Begin your journey in the global marketplace."
            actionLabel="BROWSE MARKETPLACE"
            actionHref="/courses"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {courses.map((course) => (
               <BrowseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>

      {/* Deep Learning Insights */}
      <div className="bg-indigo-600 p-12 lg:p-20 rounded-[4rem] text-white flex flex-col xl:flex-row items-center justify-between gap-16 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-100/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 space-y-8 max-w-2xl text-center xl:text-left">
             <div className="flex items-center justify-center xl:justify-start gap-3">
                <Brain className="w-8 h-8 text-white/50" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">KNOWLEDGE RECOGNITION</span>
             </div>
             <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.85]">ELEVATE YOUR <br /> SYNTHESIS</h2>
             <p className="text-lg lg:text-xl font-medium text-white/80 leading-relaxed">
               Our AI Knowledge Engine predicts a high suitability for &quot;Advanced System Dynamics&quot; based on your current trajectory. Ready to accelerate?
             </p>
             <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4">
               <Button className="rounded-full h-16 px-10 bg-white text-indigo-600 font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all shadow-2xl">
                  COMMENCE MODULE
               </Button>
               <Button variant="outline" className="rounded-full h-16 px-10 border-white/20 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                  VIEW INSIGHTS
               </Button>
             </div>
          </div>
          <div className="relative z-10 w-full xl:w-[400px] shrink-0 pointer-events-none perspective-1000">
             <div className="aspect-square bg-white/10 backdrop-blur-3xl rounded-[3rem] border border-white/20 p-8 rotate-y-12 rotate-x-6 group-hover:rotate-y-0 transition-transform duration-1000">
               {/* Decorative Dashboard Element */}
               <div className="h-full flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="h-4 w-3/4 bg-white/20 rounded-full" />
                    <div className="h-4 w-1/2 bg-white/20 rounded-full" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <div className="h-24 w-8 bg-white/40 rounded-t-xl" />
                       <div className="h-32 w-8 bg-white/60 rounded-t-xl" />
                       <div className="h-40 w-8 bg-white/80 rounded-t-xl shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
                    </div>
                    <div className="h-4 w-full bg-white/20 rounded-full" />
                  </div>
               </div>
             </div>
          </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, subText, trend }: { icon: ReactNode; label: string; value: string; subText: string; trend?: string }) {
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


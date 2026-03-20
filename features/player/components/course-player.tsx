"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useProgress } from "../hooks/use-progress";
import { VideoPlayer } from "@/components/player/video-player";
import { SummaryBox } from "@/components/ai/summary-box";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Brain,
  Video,
  FileText
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Loader } from "@/components/common/loader";
import { NoResultsState } from "@/components/common/empty-state";
import Link from "next/link";

/**
 * COURSE PLAYER ARCHITECTURE
 * The definitive, high-fidelity experience for educational consumption.
 * Orchestrates video streams, AI synthesis, and progress tracking.
 */
export function CoursePlayer({ courseId, lectureId }: { courseId: Id<"courses">, lectureId: Id<"lectures"> }) {
  const lecture = useQuery(api.lectures.getLectureById, { id: lectureId });
  const course = useQuery(api.courses.getCourseById, { id: courseId });
  const { isCompleted, isUpdating, toggleCompletion } = useProgress(courseId, lectureId);

  const isLoading = lecture === undefined || course === undefined;

  if (isLoading) return <Loader label="CALIBRATING ARCHIVE..." />;
  if (!lecture) return <NoResultsState />;

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-right-12 duration-1000">
      {/* Immersive Video Shield */}
      <div className="relative group w-full aspect-video rounded-[3rem] overflow-hidden shadow-3xl shadow-slate-950/20 bg-slate-950">
        <VideoPlayer 
           videoUrl={lecture.videoUrl} 
           title={lecture.title}
           onEnded={() => !isCompleted && toggleCompletion()} 
        />
      </div>

      {/* Curriculum Context Shield */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
        <div className="flex-1 space-y-8">
           <div className="space-y-4">
              <div className="flex items-center gap-4">
                 <Badge className="bg-indigo-600/10 text-indigo-600 border-none font-black uppercase tracking-[0.2em] text-[10px] w-fit">CURRENT MODULE</Badge>
                 {isCompleted && (
                   <Badge className="bg-emerald-500 text-white border-none font-black uppercase tracking-widest text-[9px] h-6 flex items-center gap-1.5 px-3">
                     <CheckCircle2 className="w-3 h-3" /> MASTERY SECURED
                   </Badge>
                 )}
              </div>
              <h1 className="text-4xl font-black text-slate-950 dark:text-white uppercase tracking-tight leading-tight">{lecture.title}</h1>
           </div>

           <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2.5 text-slate-500 font-bold text-sm uppercase tracking-widest">
                 <Video className="w-5 h-5 text-indigo-600" />
                 High Fidelity Asset
              </div>
              <Separator orientation="vertical" className="h-6 hidden md:block" />
              <div className="flex items-center gap-2.5 text-slate-500 font-bold text-sm uppercase tracking-widest">
                 <FileText className="w-5 h-5 text-violet-600" />
                 Curriculum Integrated
              </div>
           </div>

           <div className="p-10 bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-black/50">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-slate-950 dark:bg-white rounded-xl">
                    <Info className="w-4 h-4 text-white dark:text-slate-950" />
                 </div>
                 <h4 className="text-lg font-black uppercase tracking-tight">KNOWLEDGE CONTEXT</h4>
              </div>
              <p className="text-slate-500 leading-relaxed font-semibold">
                This academic segment explores the refined mechanisms of {lecture.title}. 
                Ensure full retention by analyzing the AI Synthesis Box below before proceeding to the subsequent module.
              </p>
           </div>
        </div>

        {/* Global Progress Action */}
        <div className="w-full lg:w-[350px] shrink-0 space-y-8">
           <Button 
             onClick={toggleCompletion}
             disabled={isUpdating}
             size="lg"
             className={`w-full h-20 rounded-full font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl active:scale-95 ${
               isCompleted 
               ? "bg-slate-100 text-slate-400 hover:bg-slate-200" 
               : "bg-indigo-600 text-white hover:bg-slate-950 shadow-indigo-600/30"
             }`}
           >
             {isUpdating ? "SYNCHRONIZING..." : isCompleted ? "UNDO COMPLETION" : "COMMIT COMPLETION"}
           </Button>

           <div className="flex items-center justify-between gap-4">
              <Link href={`/courses/${courseId}`} className="flex-1">
                 <Button variant="outline" className="w-full h-14 rounded-full border-2 border-slate-100 font-black uppercase tracking-widest text-[10px]">
                    <ChevronLeft className="w-4 h-4 mr-2" /> EXIT ARCHIVE
                 </Button>
              </Link>
              <Button variant="outline" className="flex-1 h-14 rounded-full border-2 border-slate-100 font-black uppercase tracking-widest text-[10px]">
                 NEXT MODULE <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
           </div>
        </div>
      </div>

      <Separator className="bg-slate-100 dark:bg-slate-800" />

      {/* Institutional AI Layer */}
      <div className="space-y-8 mb-24">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-violet-600 rounded-2xl shadow-xl shadow-violet-600/20">
              <Brain className="w-6 h-6 text-white" />
           </div>
           <h3 className="text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tight">KNOWLEDGE SYNTHESIS ENGINE</h3>
        </div>
        
        <SummaryBox text={course.aiSummary || "The knowledge synthesis engine is momentarily recalibrating. Detailed insights appear here upon archive processing."} />
      </div>
    </div>
  );
}

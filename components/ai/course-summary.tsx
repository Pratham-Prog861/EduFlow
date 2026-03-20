"use client";

import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { 
  Brain, 
  Wand2, 
  Sparkles, 
  Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface CourseSummaryProps {
  courseId: Id<"courses">;
  courseTitle: string;
  courseDescription: string;
  aiSummary?: string;
  lectureTitles: string[];
}

export function CourseSummary({ courseId, courseTitle, courseDescription, aiSummary, lectureTitles }: CourseSummaryProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const generateSummaryAction = useAction(api.ai.generateCourseSummary);

  const onGenerateSummary = async () => {
    if (lectureTitles.length === 0) {
      toast.error("No content to summarize yet.");
      return;
    }
    
    setIsGenerating(true);
    try {
      await generateSummaryAction({
        courseId,
        courseTitle,
        courseDescription,
        lectures: lectureTitles,
      });
      toast.success("AI Summary generated!");
    } catch {
      toast.error("AI Generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-indigo-50 dark:bg-indigo-950/20 group relative">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
        <Brain className="w-24 h-24 text-indigo-600" />
      </div>
      
      <CardContent className="p-8 space-y-8 relative z-10">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">AI Course Hub</h3>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Get an instant intelligently-generated summary of this course.</p>
          </div>
          <Button 
            onClick={onGenerateSummary}
            disabled={isGenerating}
            className="rounded-2xl bg-indigo-600 hover:bg-slate-900 dark:hover:bg-indigo-500 text-white font-black px-6 h-12 transition-all shadow-xl shadow-indigo-600/20"
          >
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
            ) : (
              <><Wand2 className="w-4 h-4 mr-2" /> {aiSummary ? "Regenerate Summary" : "Generate Summary"}</>
            )}
          </Button>
        </div>

        {aiSummary ? (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-indigo-100 dark:border-indigo-900/50 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase">Executive Summary</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-loose font-medium text-lg whitespace-pre-wrap">
              {aiSummary}
            </p>
          </div>
        ) : isGenerating ? (
          <div className="space-y-4 px-2">
            <Skeleton className="h-6 w-full rounded-full" />
            <Skeleton className="h-6 w-5/6 rounded-full" />
            <Skeleton className="h-40 w-full rounded-[2rem]" />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

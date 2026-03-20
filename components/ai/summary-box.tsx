"use client";

import { Brain, Sparkles, Copy, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SummaryBoxProps {
  summary: string;
  isLoading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export function SummaryBox({
  summary,
  isLoading,
  onRefresh,
  className
}: SummaryBoxProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    toast.success("Summary copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "relative group overflow-hidden rounded-[3rem] border border-indigo-100 dark:border-indigo-900 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-2xl shadow-indigo-500/5 p-8 md:p-12 transition-all duration-700 hover:shadow-indigo-500/10",
      className
    )}>
      {/* Decorative pulse element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 -z-10 animate-pulse" />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
        <div className="flex items-center gap-5">
           <div className="bg-indigo-600 p-4 rounded-2xl shadow-xl shadow-indigo-600/30 transform transition-transform group-hover:rotate-6 duration-500">
             <Brain className="w-8 h-8 text-white" />
           </div>
           <div className="space-y-2">
             <Badge className="bg-indigo-600/10 text-indigo-600 border-none font-black uppercase tracking-[0.2em] text-[10px] w-fit">AI GENERATED INSIGHTS</Badge>
             <h3 className="text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tight">KNOWLEDGE SYNTHESIS</h3>
           </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={onCopy}
            variant="outline" 
            className="rounded-full px-6 h-12 border-2 uppercase font-black tracking-widest text-[10px] bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 flex gap-2"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? "COPIED" : "COPY TRANSCRIPT"}
          </Button>
          {onRefresh && (
            <Button 
              onClick={onRefresh}
              disabled={isLoading}
              className="rounded-full px-6 h-12 bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-indigo-600 transition-all uppercase font-black tracking-widest text-[10px] flex gap-2 shadow-xl"
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
              REGENERATE
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
         <div className="absolute left-0 top-0 w-1.5 h-full bg-linear-to-b from-indigo-600 to-violet-600 rounded-full opacity-30" />
         <div className="pl-8 text-lg font-medium text-slate-600 dark:text-slate-300 leading-relaxed max-w-5xl selection:bg-indigo-500 selection:text-white">
            {summary.split("\n").map((para, i) => (
              <p key={i} className={cn(i > 0 && "mt-6 animate-in slide-in-from-left duration-500", "delay-" + (i * 100))}>
                {para}
              </p>
            ))}
         </div>
         {isLoading && (
           <div className="absolute inset-x-0 bottom-0 top-0 bg-white/20 dark:bg-slate-950/20 backdrop-blur-xs flex items-center justify-center rounded-2xl animate-in fade-in duration-300">
              <div className="flex gap-2">
                 <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                 <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                 <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" />
              </div>
           </div>
         )}
      </div>

      <div className="mt-12 flex items-center gap-3 text-slate-400 font-bold uppercase tracking-tighter text-[10px]">
        <Sparkles className="w-3 h-3" />
        AI CAN MAKE MISTAKES. PLEASE VERIFY CONTENT WITH ACTUAL VIDEOS.
      </div>
    </div>
  );
}

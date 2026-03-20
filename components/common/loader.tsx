"use client";

import { Loader2 } from "lucide-react";

export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full space-y-4 animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full animate-pulse" />
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin relative z-10" />
      </div>
      <p className="text-sm font-black uppercase tracking-widest text-slate-400 animate-pulse">
        Loading Excellence...
      </p>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-[9999] flex flex-col items-center justify-center space-y-8">
       <div className="flex items-center gap-3 animate-bounce">
          <div className="bg-linear-to-br from-indigo-600 to-violet-600 p-3 rounded-2xl shadow-xl shadow-indigo-500/20">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <span className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 uppercase">
            eduFlow
          </span>
       </div>
       <div className="w-48 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 bg-indigo-600 animate-infinite-progress" />
       </div>
    </div>
  );
}

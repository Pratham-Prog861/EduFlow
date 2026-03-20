"use client";

import { GraduationCap, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref
}: EmptyStateProps) {
  return (
    <div className="bg-white dark:bg-slate-950 rounded-[3rem] p-12 md:p-24 text-center border-none shadow-sm flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700">
      <div className="bg-indigo-50 dark:bg-indigo-950/40 p-6 rounded-[2rem] mb-8 shadow-xs relative">
        <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full animate-pulse" />
        {icon || <GraduationCap className="w-12 h-12 text-indigo-600 relative z-10" />}
      </div>
      <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
        {title}
      </h2>
      <p className="max-w-md text-slate-500 mt-4 leading-relaxed font-medium">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="mt-10">
          <Button className="rounded-full px-10 h-14 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/25 text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex gap-2">
            <Plus className="w-4 h-4" />
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
}

export function NoResultsState({ onClear }: { onClear?: () => void }) {
  return (
    <div className="py-24 flex flex-col items-center text-center space-y-6">
      <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl">
        <Search className="w-8 h-8 text-slate-400" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No matches found</h3>
        <p className="text-slate-500 font-medium">Try adjusting your filters or search terms.</p>
      </div>
      {onClear && (
        <Button onClick={onClear} variant="ghost" className="rounded-full font-black uppercase tracking-widest text-[10px]">
          Clear all filters
        </Button>
      )}
    </div>
  );
}

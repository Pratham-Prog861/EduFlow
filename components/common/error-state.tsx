"use client";

import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  showHome?: boolean;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred. Don't worry, our team has been notified.",
  onRetry,
  showHome = true
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-8 animate-in fade-in zoom-in duration-700 p-12 bg-white dark:bg-slate-950 rounded-[3.5rem] shadow-sm animate-glow">
      <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-[2.5rem] shadow-lg shadow-red-500/10">
        <AlertCircle className="w-16 h-16 text-red-500" />
      </div>
      <div className="space-y-4 max-w-md">
        <h2 className="text-4xl font-black text-slate-950 dark:text-white uppercase tracking-tight">
          {title}
        </h2>
        <p className="text-lg text-slate-500 font-medium leading-relaxed">
          {description}
        </p>
      </div>
      <div className="flex gap-4 pt-4">
        {onRetry && (
          <Button 
            onClick={onRetry}
            className="rounded-full px-10 h-14 bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-black uppercase tracking-widest text-xs h-10 shadow-xl transition-all hover:scale-105"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Retry Now
          </Button>
        )}
        {showHome && (
          <Link href="/">
            <Button 
                variant="outline" 
                className="rounded-full px-10 h-14 border-2 font-black uppercase tracking-widest text-xs h-10 transition-all hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <Home className="w-4 h-4 mr-2" />
              Back Home
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export function ForbiddenState() {
  return (
    <ErrorState 
      title="Access Denied" 
      description="You don't have permission to access this page. Please sign in with an account that has the required permissions."
      showHome
    />
  );
}

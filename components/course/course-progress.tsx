"use client";

import { cn } from "@/lib/utils";

interface CourseProgressProps {
    value: number;
    variant?: "default" | "success";
    size?: "default" | "sm";
    showValue?: boolean;
}

export function CourseProgress({
    value,
    variant = "default",
    size = "default",
    showValue = true,
}: CourseProgressProps) {
    return (
        <div className="space-y-2 w-full">
            {showValue && (
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                    <span>Course Completion</span>
                    <span className={cn(
                        "font-black",
                        variant === "success" ? "text-emerald-500" : "text-indigo-600"
                    )}>{Math.round(value)}%</span>
                </div>
            )}
            <div className={cn(
                "w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden",
                size === "sm" ? "h-1" : "h-2"
            )}>
                <div 
                    className={cn(
                        "h-full transition-all duration-1000 ease-out",
                        variant === "success" ? "bg-emerald-500" : "bg-indigo-600"
                    )} 
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}

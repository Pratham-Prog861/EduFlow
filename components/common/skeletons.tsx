"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Skeleton for the Student Dashboard - showing enrolled course status
 */
export function EnrolledCourseSkeleton() {
    return (
        <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white dark:bg-slate-950 flex flex-col">
            <Skeleton className="aspect-video w-full rounded-none" />
            <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                    <Skeleton className="h-7 w-3/4 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full rounded-full" />
                        <Skeleton className="h-4 w-5/6 rounded-full" />
                    </div>
                </div>
                <div className="pt-6 border-t border-slate-50 dark:border-slate-900 flex items-center justify-between">
                    <Skeleton className="h-4 w-16 rounded-full" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                </div>
            </div>
        </Card>
    );
}

/**
 * Skeleton for the Student Catalog - showing course browse cards
 */
export function BrowseCardSkeleton() {
    return (
        <Card className="rounded-[3rem] border-none shadow-sm overflow-hidden bg-white dark:bg-slate-950 h-full flex flex-col">
            <Skeleton className="aspect-video w-full" />
            <CardContent className="p-8 space-y-8">
                <div className="space-y-3">
                    <Skeleton className="h-8 w-3/4 rounded-full" />
                    <div className="flex gap-4">
                        <Skeleton className="h-4 w-20 rounded-full" />
                        <Skeleton className="h-4 w-20 rounded-full" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full rounded-full" />
                    <Skeleton className="h-4 w-5/6 rounded-full" />
                </div>
                <div className="flex items-center justify-between pt-4">
                    <Skeleton className="h-10 w-24 rounded-full" />
                    <Skeleton className="h-12 w-32 rounded-2xl" />
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Skeleton for the Instructor Dashboard - showing course management cards
 */
export function InstructorCourseSkeleton() {
    return (
        <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden bg-white dark:bg-slate-950 h-full flex flex-col">
          <Skeleton className="aspect-video w-full rounded-none" />
          <div className="p-6 space-y-3">
            <Skeleton className="h-7 w-3/4 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-5/6 rounded-full" />
            </div>
          </div>
          <div className="mt-auto px-6 pb-6 pt-2">
             <div className="flex items-center justify-between">
                 <Skeleton className="h-4 w-24 rounded-full" />
                 <Skeleton className="h-4 w-32 rounded-full" />
             </div>
          </div>
        </Card>
    );
}

/**
 * Skeleton for Course Detail pages
 */
export function DetailPageSkeleton() {
    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
            <Skeleton className="h-10 w-48 rounded-full" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <Skeleton className="lg:col-span-2 h-[600px] rounded-[3rem]" />
            <div className="space-y-6">
                <Skeleton className="h-[400px] rounded-[3rem]" />
                <Skeleton className="h-[200px] rounded-[3rem]" />
            </div>
            </div>
        </div>
    );
}

/**
 * Skeleton for the Content Management page
 */
export function ContentPageSkeleton() {
    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
        <div className="flex justify-between items-center">
            <div className="space-y-3">
                <Skeleton className="h-10 w-64 rounded-full" />
                <Skeleton className="h-4 w-96 rounded-full" />
            </div>
            <div className="flex gap-4">
                <Skeleton className="h-10 w-32 rounded-full" />
                <Skeleton className="h-10 w-32 rounded-full" />
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-48 w-full rounded-[2rem]" />
                <Skeleton className="h-48 w-full rounded-[2rem]" />
                <Skeleton className="h-10 w-full rounded-full" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-64 w-full rounded-[2rem]" />
                <Skeleton className="h-48 w-full rounded-[2rem]" />
            </div>
        </div>
      </div>
    );
}

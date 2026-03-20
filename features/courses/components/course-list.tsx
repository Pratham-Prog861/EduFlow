"use client";

import { useCourses } from "../hooks/use-courses";
import { BrowseCard } from "@/components/course/browse-card";
import { BrowseCardSkeleton } from "@/components/common/skeletons";
import { NoResultsState, EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

/**
 * COURSE CATALOG COMPONENT
 * The entry point for exploring global knowledge paths.
 * Features built-in search, filtering, and optimized loading.
 */
export function CourseList() {
  const { courses, searchQuery, setSearchQuery, isLoading, isEmpty } = useCourses();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Catalog Search Shield */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
         <div className="space-y-3">
            <Badge className="bg-indigo-600/10 text-indigo-600 border-none font-black uppercase tracking-[0.2em] text-[10px] w-fit">GLOBAL DIRECTORY</Badge>
            <h2 className="text-4xl font-black text-slate-930 dark:text-white uppercase tracking-tight">KNOWLEDGE ARCHIVE</h2>
         </div>

         <div className="relative w-full max-w-md group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            </div>
            <Input 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Filter by title or keywords..." 
               className="h-16 pl-14 pr-8 rounded-[2rem] bg-white dark:bg-slate-900 border-2 border-transparent focus:border-indigo-600 shadow-xl shadow-slate-200/50 dark:shadow-black/50 transition-all font-bold text-lg"
            />
         </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-24">
          {[...Array(8)].map((_, i) => (
            <BrowseCardSkeleton key={i} />
          ))}
        </div>
      ) : isEmpty ? (
        <div className="py-24">
           {searchQuery ? (
             <NoResultsState onClear={() => setSearchQuery("")} />
           ) : (
             <EmptyState 
               title="Archive Depleted" 
               description="The global knowledge repository is currently being recalibrated. New data streams soon."
             />
           )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mb-24">
          {courses.map((course) => (
            <BrowseCard 
                key={course._id} 
                course={course}
                className="hover:scale-105 transition-transform duration-500" 
            />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { 
  BookOpen, 
  ArrowRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrowseCard } from "@/components/course/course-card";
import { BrowseCardSkeleton } from "@/components/common/skeletons";

export default function StudentCoursesPage() {
  const courses = useQuery(api.courses.getCoursesForStudents);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = courses?.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Explore Catalog</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Empowering your future with curated course paths.</p>
        </div>
        <div className="relative group w-full md:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            <Input 
                placeholder="Search courses..." 
                className="rounded-full pl-14 h-14 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-600/20 text-lg shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {!courses ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
             <BrowseCardSkeleton key={n} />
          ))}
        </div>
      ) : filteredCourses?.length === 0 ? (
        <div className="text-center py-20 px-8 rounded-[3rem] bg-slate-50/50">
             <div className="bg-white p-6 rounded-full shadow-md w-fit mx-auto mb-8">
                <Search className="w-12 h-12 text-slate-300" />
             </div>
             <h3 className="text-2xl font-black text-slate-900">No courses match your search</h3>
             <p className="text-slate-500 mt-4 leading-relaxed font-medium">Try different keywords or check back later for new content.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses?.map((course) => (
            <BrowseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}


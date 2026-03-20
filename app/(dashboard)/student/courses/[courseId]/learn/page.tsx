"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function LearnRedirectPage() {
  const params = useParams();
  const courseId = params.courseId as Id<"courses">;
  const router = useRouter();
  
  // Get all lectures for the course
  const lectures = useQuery(api.lectures.getLecturesByCourse, { courseId });

  useEffect(() => {
    if (lectures) {
      if (lectures.length > 0) {
        // Redirect to the first lecture in the list
        // Note: For deterministic ordering, we might want to sort by section order and lecture order later.
        router.push(`/dashboard/student/courses/${courseId}/learn/${lectures[0]._id}`);
      } else {
        toast.error("This course has no lectures yet.");
        router.push(`/dashboard/student/courses/${courseId}`);
      }
    }
  }, [lectures, courseId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] gap-4">
        <Skeleton className="h-12 w-48 rounded-full" />
        <p className="text-slate-500 font-bold animate-pulse text-sm tracking-widest uppercase">Initializing Course Player...</p>
    </div>
  );
}


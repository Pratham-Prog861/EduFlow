"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { 
  GraduationCap, 
  BookOpen, 
  ArrowLeft, 
  CheckCircle2, 
  Play, 
  Clock, 
  Users, 
  Star,
  Zap,
  ShieldCheck,
  Video,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { CourseSummary } from "@/components/ai/course-summary";
import { DetailPageSkeleton } from "@/components/common/skeletons";

export default function CourseDetailsPage() {
  const params = useParams();
  const courseId = params.courseId as Id<"courses">;
  const router = useRouter();

  const course = useQuery(api.courses.getCourseById, { courseId });
  const isEnrolled = useQuery(api.enrollments.checkEnrollment, { courseId });
  const enroll = useMutation(api.enrollments.enroll);
  const sections = useQuery(api.sections.getSectionsByCourse, { courseId });
  const lectures = useQuery(api.lectures.getLecturesByCourse, { courseId });
  const enrollmentCount = useQuery(api.enrollments.getEnrollmentCountByCourse, { courseId });

  const onEnroll = async () => {
    try {
      await enroll({ courseId });
      toast.success("Successfully enrolled in " + course?.title);
      router.push("/dashboard/student");
    } catch {
      toast.error("Failed to enroll");
    }
  };

  if (course === undefined) {
    return <DetailPageSkeleton />;
  }

  if (course === null) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[600px] text-center space-y-8 max-w-lg mx-auto">
              <div className="bg-red-50 p-8 rounded-full">
                  <X className="w-16 h-16 text-red-500" />
              </div>
              <div className="space-y-4">
                  <h1 className="text-4xl font-black text-slate-900 leading-tight">Course Not Found</h1>
                  <p className="text-slate-500 font-medium text-lg leading-relaxed">
                      We couldn&apos;t find the course you&apos;re looking for. It may have been removed or the link is incorrect.
                  </p>
              </div>
              <Link href="/dashboard/student/courses">
                  <Button className="rounded-full bg-slate-900 hover:bg-indigo-600 px-10 h-14 font-black text-md transition-all">
                      Go Back to Catalog
                  </Button>
              </Link>
          </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="group mb-8">
        <Link href="/dashboard/student/courses" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-black uppercase tracking-widest text-[10px]">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-6">
            <h1 className="text-5xl font-black tracking-tight text-slate-900 leading-tight">
                {course.title}
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed font-semibold">
                {course.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-10 items-center bg-slate-50/50 p-8 rounded-[2.5rem]">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20">
                 <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 leading-none">{enrollmentCount ?? 0}</p>
                <p className="text-[10px] font-black tracking-widest uppercase text-slate-400 mt-1">Students</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/20">
                 <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 leading-none">{sections?.length || 0}</p>
                <p className="text-[10px] font-black tracking-widest uppercase text-slate-400 mt-1">Modules</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-rose-500 p-2.5 rounded-2xl shadow-lg shadow-rose-500/20">
                 <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 leading-none">FREE</p>
                <p className="text-[10px] font-black tracking-widest uppercase text-slate-400 mt-1">Pricing</p>
              </div>
            </div>
          </div>

          <div className="space-y-10">
          <CourseSummary 
            courseId={courseId}
            courseTitle={course.title}
            courseDescription={course.description}
            aiSummary={course.aiSummary}
            lectureTitles={lectures?.map(l => l.title) || []}
          />

            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4">
               Curriculum
               <div className="h-px bg-slate-100 flex-1" />
            </h2>
            <div className="space-y-6">
               {sections?.map((section, idx) => (
                   <CurriculumItem key={section._id} section={section} index={idx + 1} />
               ))}
               {(!sections || sections.length === 0) && (
                   <div className="bg-slate-50 border-4 border-dashed border-slate-100 rounded-[2.5rem] py-16 text-center">
                       <p className="text-slate-400 font-bold">The instructor is still preparing the content.</p>
                   </div>
               )}
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 space-y-8">
          <Card className="rounded-[3rem] border-none shadow-2xl shadow-indigo-500/10 overflow-hidden bg-white dark:bg-slate-950">
            <div className="p-10 space-y-8 text-center">
               <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-50">
                  <Image 
                    src={course.thumbnailUrl || "/course-placeholder.jpg"} 
                    alt={course.title} 
                    layout="fill" 
                    className="object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group/play cursor-pointer">
                     <div className="bg-white p-6 rounded-full shadow-2xl scale-125 group-hover/play:scale-135 transition-transform duration-500">
                        <Play className="w-8 h-8 text-indigo-600 fill-indigo-600" />
                     </div>
                  </div>
               </div>

               <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-center gap-3">
                      <Zap className="w-8 h-8 text-amber-400 fill-amber-400" />
                      <span className="text-5xl font-black italic tracking-tighter text-slate-900">FREE</span>
                  </div>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Lifetime Access Included</p>
               </div>

               {isEnrolled ? (
                 <Link href={`/dashboard/student/courses/${course._id}/learn`}>
                    <Button className="w-full rounded-full bg-emerald-500 hover:bg-emerald-600 h-16 text-lg font-black shadow-xl shadow-emerald-500/20 transition-all active:scale-95">
                        Start Learning Now
                    </Button>
                 </Link>
               ) : (
                 <Button 
                    onClick={onEnroll} 
                    className="w-full rounded-full bg-indigo-600 hover:bg-indigo-700 h-16 text-lg font-black shadow-xl shadow-indigo-500/20 transition-all active:scale-95 animate-pulse-slow"
                 >
                    Enroll For Free Today
                 </Button>
               )}

               <div className="pt-8 space-y-4 border-t border-slate-50 flex flex-col items-start gap-4">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                     <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Premium Learning Experience
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                     <ShieldCheck className="w-5 h-5 text-indigo-500" /> Certificate of Course Completion
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                     <Video className="w-5 h-5 text-rose-500" /> Full High-Definition Content
                  </div>
               </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CurriculumItem({ section, index }: { section: Doc<"sections">, index: number }) {
  const lectures = useQuery(api.lectures.getLecturesBySection, { sectionId: section._id });

  return (
    <Card className="rounded-[2.5rem] border-none shadow-sm bg-white dark:bg-slate-950 overflow-hidden group/item">
      <div className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
         <div className="flex items-center gap-6">
            <div className="text-3xl font-black text-indigo-600/20 group-hover/item:text-indigo-600 group-hover/item:scale-110 transition-all duration-500 scale-125">
                {index < 10 ? `0${index}` : index}
            </div>
            <div>
               <h4 className="text-xl font-black text-slate-900 group-hover/item:text-indigo-600 transition-colors">{section.title}</h4>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{lectures?.length || 0} Lectures Included</p>
            </div>
         </div>
         <div className="flex items-center sm:flex-col sm:items-end gap-2 text-slate-400 opacity-60">
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">~ 45 Min</span>
         </div>
      </div>
    </Card>
  );
}





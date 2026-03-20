"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChevronLeft, GraduationCap, Loader2 } from "lucide-react";
import Link from "next/link";
import { ThumbnailUpload } from "@/components/course/thumbnail-upload";

interface CourseFormValues {
  title: string;
  description: string;
  thumbnailUrl: string;
}

const DEFAULT_THUMBNAIL =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80";

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const createCourse = useMutation(api.courses.createCourse);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseFormValues>({
    defaultValues: {
      thumbnailUrl: "",
    },
  });

  const thumbnailUrl = watch("thumbnailUrl");

  const onSubmit = async (data: CourseFormValues) => {
    try {
      setLoading(true);
      const courseId = await createCourse({
        title: data.title,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl || DEFAULT_THUMBNAIL,
      });

      toast.success("Course created successfully");
      router.push(`/dashboard/instructor/courses/${courseId}/content`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex items-center gap-x-2 transition-all group">
        <Link
          href="/dashboard/instructor/courses"
          className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Courses
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Create a New Course</h1>
          <p className="text-slate-500">Provide the basic details to get your course started.</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-950/50 p-3 rounded-2xl">
          <GraduationCap className="w-8 h-8 text-indigo-600" />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card className="rounded-3xl border-none shadow-sm bg-white dark:bg-slate-950">
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
                <CardDescription>
                  Everything students need to know at a glance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1">Course Title</label>
                  <Input
                    {...register("title", { required: "Title is required" })}
                    placeholder="e.g. Master React and Next.js"
                    className="rounded-2xl border-slate-200 dark:border-slate-800 h-12 focus-visible:ring-indigo-600/20"
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500 ml-1">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1">Description</label>
                  <Textarea
                    {...register("description", {
                      required: "Description is required",
                    })}
                    placeholder="Describe what students will learn in this course..."
                    className="rounded-2xl border-slate-200 dark:border-slate-800 min-h-[150px] focus-visible:ring-indigo-600/20"
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 ml-1">{errors.description.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl border-none shadow-sm bg-white dark:bg-slate-950 overflow-hidden">
              <CardHeader>
                <CardTitle>Thumbnail</CardTitle>
                <CardDescription>Upload from your computer or paste a URL.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ThumbnailUpload
                  value={thumbnailUrl}
                  onChange={(url) => setValue("thumbnailUrl", url, { shouldValidate: true })}
                />

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 ml-1">
                    Thumbnail URL
                  </label>
                  <Input
                    {...register("thumbnailUrl")}
                    placeholder="https://..."
                    className="rounded-xl border-slate-200 dark:border-slate-800 h-10 focus-visible:ring-indigo-600/20 text-xs"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl h-12 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/20 font-bold tracking-tight transition-all active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Course"
                )}
              </Button>
              <Link href="/dashboard/instructor/courses">
                <Button variant="ghost" className="w-full rounded-2xl h-12">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

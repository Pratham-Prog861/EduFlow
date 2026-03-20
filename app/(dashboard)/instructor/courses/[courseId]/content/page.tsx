"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id, Doc } from "@/convex/_generated/dataModel";
import {
  Edit2,
  Trash2,
  Video,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  PlusCircle,
  PlayCircle,
  Eye,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ContentPageSkeleton } from "@/components/common/skeletons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VideoUpload } from "@/components/course/video-upload";

export default function CourseContentPage() {
  const params = useParams();
  const courseId = params.courseId as Id<"courses">;

  const course = useQuery(api.courses.getCourseById, { courseId });
  const sections = useQuery(api.sections.getSectionsByCourse, { courseId });
  const lectures = useQuery(api.lectures.getLecturesByCourse, { courseId });

  const createSection = useMutation(api.sections.createSection);
  const setCoursePublished = useMutation(api.courses.setCoursePublished);

  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [isAddingSection, setIsAddingSection] = useState(false);

  const onAddSection = async () => {
    if (!newSectionTitle) return;
    try {
      await createSection({
        courseId,
        title: newSectionTitle,
        order: (sections?.length || 0) + 1,
      });
      setNewSectionTitle("");
      setIsAddingSection(false);
      toast.success("Section added");
    } catch {
      toast.error("Failed to add section");
    }
  };

  const onTogglePublish = async () => {
    if (!course) return;

    try {
      await setCoursePublished({
        courseId,
        published: !course.isPublished,
      });
      toast.success(course.isPublished ? "Course moved to draft" : "Course published");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update course status";
      toast.error(message);
    }
  };

  if (!course) {
    return <ContentPageSkeleton />;
  }

  const totalLectures = lectures?.length || 0;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{course.title} Content</h1>
          <p className="text-slate-500 mt-1">
            Organize your course structure with sections and lectures.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full">
            Preview Course
          </Button>
          <Button
            onClick={onTogglePublish}
            className="rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
          >
            {course.isPublished ? "Unpublish Course" : "Publish Course"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {sections
            ?.sort((a, b) => a.order - b.order)
            .map((section) => (
              <SectionItem key={section._id} section={section} />
            ))}

          {isAddingSection ? (
            <Card className="rounded-3xl border-2 border-dashed border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 p-6">
              <div className="flex flex-col gap-4">
                <Input
                  placeholder="e.g. Introduction to Next.js"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  className="rounded-2xl h-12 border-none shadow-sm focus-visible:ring-indigo-600/20"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <Button onClick={onAddSection} className="rounded-xl bg-indigo-600">
                    Save Section
                  </Button>
                  <Button
                    variant="ghost"
                    className="rounded-xl"
                    onClick={() => setIsAddingSection(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Button
              variant="outline"
              className="w-full h-16 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all text-slate-500 group"
              onClick={() => setIsAddingSection(true)}
            >
              <PlusCircle className="w-5 h-5 mr-2 group-hover:text-indigo-600" />
              Add a new section
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <Card className="rounded-3xl shadow-sm border-none bg-indigo-600 text-white overflow-hidden">
            <div className="p-8 space-y-4">
              <div className="bg-white/20 p-3 rounded-2xl w-fit">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Course Overview</h3>
                <p className="text-indigo-100 text-sm mt-1">
                  Status: {course.isPublished ? "Published" : "Draft"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <p className="text-2xl font-bold">{sections?.length || 0}</p>
                  <p className="text-xs text-indigo-100 uppercase tracking-wider font-semibold">
                    Sections
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalLectures}</p>
                  <p className="text-xs text-indigo-100 uppercase tracking-wider font-semibold">
                    Lectures
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl shadow-xs border-none bg-white dark:bg-slate-950">
            <CardHeader>
              <CardTitle className="text-lg">Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-500 space-y-4">
              <p>- Keep sections short (2-5 lectures).</p>
              <p>- Use clear lecture titles.</p>
              <p>- Upload at least one lecture video before publishing.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SectionItem({ section }: { section: Doc<"sections"> }) {
  const lectures = useQuery(api.lectures.getLecturesBySection, {
    sectionId: section._id,
  });
  const [isOpen, setIsOpen] = useState(true);
  const [isAddingLecture, setIsAddingLecture] = useState(false);
  const [newLectureTitle, setNewLectureTitle] = useState("");

  const createLecture = useMutation(api.lectures.createLecture);
  const deleteSection = useMutation(api.sections.deleteSection);
  const deleteLecture = useMutation(api.lectures.deleteLecture);

  const onAddLecture = async () => {
    if (!newLectureTitle) return;
    try {
      await createLecture({
        sectionId: section._id,
        courseId: section.courseId,
        title: newLectureTitle,
        videoUrl: "",
        isPreview: false,
        order: (lectures?.length || 0) + 1,
      });
      setNewLectureTitle("");
      setIsAddingLecture(false);
      toast.success("Lecture added");
    } catch {
      toast.error("Failed to add lecture");
    }
  };

  const onDeleteSection = async () => {
    if (confirm("Delete this section and all lectures?")) {
      await deleteSection({ id: section._id });
      toast.info("Section deleted");
    }
  };

  const onDeleteLecture = async (id: Id<"lectures">) => {
    if (confirm("Delete this lecture?")) {
      await deleteLecture({ id });
      toast.info("Lecture deleted");
    }
  };

  return (
    <Card className="rounded-[2rem] border-none shadow-sm bg-white dark:bg-slate-950 overflow-hidden group">
      <div className="p-4 border-b border-slate-50 dark:border-slate-900 flex items-center gap-4 bg-slate-50/30 dark:bg-slate-900/10">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-white dark:hover:bg-slate-900 shadow-sm transition-all"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
        <div className="flex-1">
          <h3 className="font-bold text-slate-950 dark:text-white flex items-center gap-2">
            Section {section.order}: {section.title}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 uppercase tracking-wider font-semibold">
            {lectures?.length || 0} Lectures
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Edit2 className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={onDeleteSection}>
            <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-600 transition-colors" />
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="p-6 space-y-4">
          {lectures
            ?.sort((a, b) => a.order - b.order)
            .map((lecture) => (
              <div
                key={lecture._id}
                className="group/item flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 shadow-xs hover:shadow-md transition-all border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900"
              >
                <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-xs group-hover/item:text-indigo-600 transition-colors">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    {lecture.title}
                    {lecture.isPreview && (
                      <Badge className="text-[10px] py-0 bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-4 flex items-center justify-center">
                        PREVIEW
                      </Badge>
                    )}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lecture.videoUrl ? "Video uploaded" : "No video yet"}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                  <Dialog>
                    <DialogTrigger>
                      <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs font-semibold hover:text-indigo-600">
                        <Settings className="w-3.5 h-3.5 mr-1.5" /> Manage
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white dark:bg-slate-950 border-none rounded-3xl overflow-hidden shadow-2xl">
                      <DialogHeader className="p-6 border-b border-slate-50 dark:border-slate-900">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                          <Video className="w-5 h-5 text-indigo-600" />
                          {lecture.title} Settings
                        </DialogTitle>
                      </DialogHeader>
                      <div className="p-8 space-y-8">
                        <div className="space-y-3">
                          <label className="text-sm font-bold uppercase tracking-widest text-slate-400">
                            Lecture Video
                          </label>
                          <VideoUpload lectureId={lecture._id} initialUrl={lecture.videoUrl || undefined} />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger>
                      <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs font-semibold hover:text-indigo-600" disabled={!lecture.videoUrl}>
                        <Eye className="w-3.5 h-3.5 mr-1.5" /> View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl bg-black border-none text-white p-0 rounded-3xl overflow-hidden aspect-video">
                      {lecture.videoUrl ? (
                        <video src={lecture.videoUrl} controls className="w-full h-full" autoPlay />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                          No video uploaded yet
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-lg text-xs font-semibold hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteLecture(lecture._id);
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}

          {isAddingLecture ? (
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Input
                value={newLectureTitle}
                onChange={(e) => setNewLectureTitle(e.target.value)}
                placeholder="Lecture title"
                className="rounded-xl"
                autoFocus
              />
              <Button onClick={onAddLecture} className="rounded-xl bg-indigo-600">
                Save Lecture
              </Button>
              <Button variant="ghost" className="rounded-xl" onClick={() => setIsAddingLecture(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-dashed"
              onClick={() => setIsAddingLecture(true)}
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Add Lecture
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}

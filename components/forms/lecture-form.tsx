"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Doc } from "@/convex/_generated/dataModel";
import { 
  Video, 
  FileText, 
  Sparkles, 
  Plus, 
  ArrowRight,
  GraduationCap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { VideoUpload } from "@/components/course/video-upload";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
});

interface LectureFormProps {
  initialData?: Doc<"lectures">;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  onCancel?: () => void;
}

export function LectureForm({ initialData, onSubmit, onCancel }: LectureFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      videoUrl: initialData?.videoUrl || "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-12 animate-in fade-in slide-in-from-right-12 duration-1000">
        <div className="space-y-10">
          <div className="space-y-4">
             <Badge className="bg-indigo-600/10 text-indigo-600 border-none font-black uppercase tracking-[0.2em] text-[10px] w-fit">LECTURE CONFIGURATION</Badge>
             <h2 className="text-4xl font-black text-slate-950 dark:text-white uppercase tracking-tight leading-[0.9]">CONTENT <br /> SYNTHESIS</h2>
             <p className="text-slate-500 font-medium max-w-lg">Every lecture is a building block of knowledge. Provide clear titles and comprehensive descriptions to guide your students.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">LECTURE IDENTIFIER</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Introduction to Neural Networks" 
                          {...field} 
                          className="h-16 rounded-[1.8rem] px-8 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-950 shadow-xs transition-all text-lg font-bold"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-black tracking-widest text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">KNOWLEDGE ABSTRACT</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Summarize the core learnings and key takeaways..." 
                          {...field} 
                          className="min-h-[180px] rounded-[2.2rem] p-8 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-950 shadow-xs transition-all text-md font-medium leading-relaxed"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-black tracking-widest text-red-500" />
                    </FormItem>
                  )}
                />
             </div>

             <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">MEDIA STREAM (VIDEO)</FormLabel>
                      <FormControl>
                        <div className="space-y-6">
                           <VideoUpload 
                             value={field.value || ""} 
                             onChange={field.onChange}
                             onRemove={() => field.onChange("")}
                           />
                           {field.value && (
                             <div className="p-8 rounded-[2.5rem] bg-indigo-600 shadow-2xl shadow-indigo-500/30 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-[60px] rounded-full animate-pulse" />
                                <div className="relative z-10 flex items-center gap-5">
                                   <div className="bg-white/20 p-4 rounded-2xl">
                                      <Video className="w-8 h-8 text-white" />
                                   </div>
                                   <div className="space-y-1">
                                      <h4 className="text-lg font-black text-white uppercase tracking-tight">VIDEO ENABLED</h4>
                                      <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">READY FOR DEPLOYMENT</p>
                                   </div>
                                </div>
                             </div>
                           )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-black tracking-widest text-red-500" />
                    </FormItem>
                  )}
                />
             </div>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-6">
          {onCancel && (
            <Button 
                type="button" 
                variant="ghost" 
                onClick={onCancel}
                className="rounded-full px-10 h-14 font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              DISCONTINUE
            </Button>
          )}
          <Button 
            disabled={isSubmitting}
            type="submit" 
            className="rounded-full px-12 h-16 bg-indigo-600 hover:bg-slate-950 text-white dark:hover:bg-white dark:hover:text-slate-950 font-black uppercase tracking-widest text-xs h-10 shadow-3xl shadow-indigo-500/20 active:scale-95 transition-all group shrink-0"
          >
            {isSubmitting ? (
              "PROCESSING..."
            ) : (
              <span className="flex items-center gap-3">
                {initialData ? "COMMIT UPDATES" : "APPEND LECTURE"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

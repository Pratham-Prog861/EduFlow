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
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { 
  Plus, 
  Layout, 
  FileText, 
  Image as ImageIcon, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  GraduationCap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { VideoUpload } from "@/components/course/video-upload";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().optional(),
});

interface CourseFormProps {
  initialData?: Doc<"courses">;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
}

export function CourseForm({ initialData, onSubmit }: CourseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      imageUrl: initialData?.imageUrl || "",
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column: Core Details */}
          <div className="space-y-12">
            <div className="space-y-4">
               <Badge className="bg-indigo-600/10 text-indigo-600 border-none font-black uppercase tracking-[0.2em] text-[10px] w-fit">MODIFICATION PANEL</Badge>
               <h2 className="text-4xl font-black text-slate-950 dark:text-white uppercase tracking-tight leading-[0.9]">ESSENTIALS</h2>
               <p className="text-slate-500 font-medium">Define the core identity of your educational space. This information will be visible to all prospective students.</p>
            </div>

            <div className="space-y-10 group">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Course Designation</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Advanced Quantum Computing" 
                        {...field} 
                        className="h-16 rounded-[2rem] px-8 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-950 shadow-xs transition-all text-lg font-bold"
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
                  <FormItem className="space-y-4">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Knowledge Manifesto</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Articulate the vision and value proposition of this learning path..." 
                        {...field} 
                        className="min-h-[220px] rounded-[2.5rem] p-8 bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-950 shadow-xs transition-all text-md font-medium leading-relaxed"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] uppercase font-black tracking-widest text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Right Column: Visual Identity */}
          <div className="space-y-12">
            <div className="space-y-4">
               <Badge className="bg-amber-600/10 text-amber-600 border-none font-black uppercase tracking-[0.2em] text-[10px] w-fit">VISUAL SYNTHESIS</Badge>
               <h2 className="text-4xl font-black text-slate-950 dark:text-white uppercase tracking-tight leading-[0.9]">BRANDING</h2>
               <p className="text-slate-500 font-medium">A strong visual identity increases student engagement and course perceived value.</p>
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Identifier (Image)</FormLabel>
                  <FormControl>
                    <div className="space-y-8">
                       <VideoUpload 
                         value={field.value || ""} 
                         onChange={field.onChange}
                         onRemove={() => field.onChange("")}
                       />
                       {field.value && (
                         <div className="p-10 rounded-[3rem] bg-indigo-600 shadow-2xl shadow-indigo-500/30 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
                            <div className="relative z-10 space-y-4">
                               <div className="flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-white" />
                                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100">AI PREVIEW ACTIVE</span>
                               </div>
                               <h3 className="text-2xl font-black text-white uppercase tracking-tight">IDENTITY SET</h3>
                               <p className="text-indigo-100/70 text-sm font-medium">Your course identity is now established across the global network.</p>
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

        <div className="pt-16 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-8">
          <div className="flex items-center gap-6">
             <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-2xl shadow-xs group-hover:rotate-12 transition-transform">
                <GraduationCap className="w-8 h-8 text-slate-500" />
             </div>
             <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-tight">Deployment Strategy</h4>
                <p className="text-xs text-slate-400 font-medium">Your changes will propagate instantly to all active clusters.</p>
             </div>
          </div>

          <Button 
            disabled={isSubmitting}
            type="submit" 
            className="rounded-full px-12 h-16 bg-indigo-600 hover:bg-slate-950 text-white dark:hover:bg-white dark:hover:text-slate-950 font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-500/20 active:scale-95 transition-all group shrink-0"
          >
            {isSubmitting ? (
              "SYNCHRONIZING..."
            ) : (
              <span className="flex items-center gap-3">
                {initialData ? "COMMIT UPDATES" : "INITIALIZE ACADEMY"}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

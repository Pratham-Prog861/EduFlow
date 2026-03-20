"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useRef, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { CheckCircle2, X, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface VideoUploadProps {
  lectureId: Id<"lectures">;
  initialUrl?: string;
  onSuccess?: (url: string) => void;
}

interface CloudinaryResult {
  event: string;
  info: {
    secure_url: string;
    public_id: string;
    [key: string]: unknown;
  };
}

interface CloudinaryWidget {
  open: () => void;
  destroy?: () => void;
}

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: object,
        callback: (error: Error | null, result: CloudinaryResult) => void,
      ) => CloudinaryWidget;
    };
  }
}

export function VideoUpload({ lectureId, initialUrl, onSuccess }: VideoUploadProps) {
  const [loading, setLoading] = useState(false);
  const [progress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null);
  const updateLecture = useMutation(api.lectures.updateLecture);
  const widgetRef = useRef<CloudinaryWidget | null>(null);

  useEffect(() => {
    setPreviewUrl(initialUrl ?? null);
  }, [initialUrl]);

  useEffect(() => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return;
    }

    const init = () => {
      if (!window.cloudinary) return;
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          sources: ["local", "url", "google_drive"],
          multiple: false,
          resourceType: "video",
        },
        async (error: Error | null, result: CloudinaryResult) => {
          if (!error && result && result.event === "success") {
            const videoUrl = result.info.secure_url;
            setPreviewUrl(videoUrl);
            await updateLecture({ id: lectureId, videoUrl });
            toast.success("Video uploaded successfully");
            if (onSuccess) onSuccess(videoUrl);
            setLoading(false);
          } else if (error) {
            toast.error("Upload failed: " + error.message);
            setLoading(false);
          }
        },
      );
    };

    const existing = document.querySelector('script[data-cloudinary-widget="true"]');
    if (existing) {
      init();
    } else {
      const script = document.createElement("script");
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.async = true;
      script.dataset.cloudinaryWidget = "true";
      script.onload = init;
      document.body.appendChild(script);
    }

    return () => {
      widgetRef.current?.destroy?.();
    };
  }, [lectureId, updateLecture, onSuccess]);

  const onUpload = () => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast.error("Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local");
      return;
    }

    if (widgetRef.current) {
      setLoading(true);
      widgetRef.current.open();
    } else {
      toast.error("Widget not initialized yet");
    }
  };

  const onRemoveVideo = async () => {
    try {
      await updateLecture({ id: lectureId, videoUrl: "" });
      setPreviewUrl(null);
      toast.success("Video removed");
    } catch {
      toast.error("Failed to remove video");
    }
  };

  return (
    <div className="w-full">
      {!previewUrl ? (
        <div
          className="group border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-900/10"
          onClick={onUpload}
        >
          <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-sm group-hover:bg-indigo-600 transition-colors">
            <UploadCloud className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors" />
          </div>
          <div className="text-center">
            <h4 className="font-bold text-slate-950 dark:text-white">Ready to upload?</h4>
            <p className="text-sm text-slate-500 mt-1">Select a video file to add content to this lecture.</p>
          </div>
          <Button variant="outline" className="rounded-full mt-2 h-10 border-indigo-100 dark:border-indigo-900 text-indigo-600">
            Choose File
          </Button>
        </div>
      ) : (
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border-4 border-white dark:border-slate-900 shadow-xl group">
          <video src={previewUrl} className="w-full h-full object-cover" controls />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <Button onClick={onUpload} className="rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold">
              Change Video
            </Button>
            <Button
              variant="outline"
              className="rounded-full bg-slate-950/20 text-white border-white/20 hover:bg-slate-950/40"
              onClick={onRemoveVideo}
            >
              <X className="w-4 h-4 mr-2" /> Remove
            </Button>
          </div>
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1 scale-110 shadow-lg">
              <CheckCircle2 className="w-3 h-3 mr-1.5" /> UPLOADED
            </Badge>
          </div>
        </div>
      )}

      {loading && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Uploading to Cloudinary...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 rounded-full bg-slate-100 dark:bg-slate-800" />
        </div>
      )}
    </div>
  );
}

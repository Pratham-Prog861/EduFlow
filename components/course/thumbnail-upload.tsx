"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ThumbnailUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

interface CloudinaryUploadResult {
  event: string;
  info?: {
    secure_url?: string;
  };
}

type CloudinaryWidget = {
  open: () => void;
  destroy?: () => void;
};

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: Error | null, result: CloudinaryUploadResult) => void,
      ) => CloudinaryWidget;
    };
  }
}

function isValidImageSrc(src: string) {
  if (!src) return false;
  if (src.startsWith("/")) return true;

  try {
    const parsed = new URL(src);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function ThumbnailUpload({ value, onChange }: ThumbnailUploadProps) {
  const [initializing, setInitializing] = useState(true);
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  const normalizedValue = value?.trim() ?? "";
  const canPreview = isValidImageSrc(normalizedValue);

  const initWidget = useCallback(() => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!window.cloudinary) return;
    if (!cloudName || !uploadPreset) {
      setInitializing(false);
      return;
    }

    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ["local", "url"],
        multiple: false,
        resourceType: "image",
        maxFiles: 1,
      },
      (error, result) => {
        if (error) {
          toast.error("Thumbnail upload failed: " + error.message);
          return;
        }

        if (result.event === "success" && result.info?.secure_url) {
          onChange(result.info.secure_url);
          toast.success("Thumbnail uploaded");
        }
      },
    );

    setInitializing(false);
  }, [onChange]);

  useEffect(() => {
    const existing = document.querySelector('script[data-cloudinary-widget="true"]');
    if (existing) {
      initWidget();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    script.dataset.cloudinaryWidget = "true";
    script.onload = initWidget;
    script.onerror = () => {
      setInitializing(false);
      toast.error("Could not load upload widget");
    };

    document.body.appendChild(script);

    return () => {
      if (widgetRef.current?.destroy) {
        widgetRef.current.destroy();
      }
    };
  }, [initWidget]);

  const openWidget = () => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast.error("Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local");
      return;
    }

    if (!widgetRef.current) {
      toast.error("Upload widget is still loading. Please retry.");
      return;
    }

    widgetRef.current.open();
  };

  return (
    <div className="space-y-3">
      <div className="aspect-video overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
        {canPreview ? (
          <Image
            src={normalizedValue}
            alt="Course thumbnail"
            width={800}
            height={450}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-slate-500">
            <ImagePlus className="h-8 w-8" />
            <p className="mt-2 text-xs">Upload thumbnail</p>
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={openWidget}
        disabled={initializing}
        className="w-full rounded-xl"
      >
        {initializing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading uploader
          </>
        ) : normalizedValue ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Replace Thumbnail
          </>
        ) : (
          <>
            <ImagePlus className="mr-2 h-4 w-4" />
            Upload from Computer
          </>
        )}
      </Button>
    </div>
  );
}

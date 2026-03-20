"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { 
  PlayCircle, 
  PauseCircle, 
  Volume2, 
  Maximize2, 
  Settings, 
  Lock, 
  ChevronRight, 
  GraduationCap,
  Sparkles,
  Zap
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VideoPlayerProps {
  url: string;
  onComplete?: () => void;
  title: string;
}

export function VideoPlayer({
  url,
  onComplete,
  title
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current?.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const onTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="group relative aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-500/10 border-8 border-slate-100 dark:border-slate-900 transition-all duration-700 hover:shadow-indigo-500/20">
      {/* Abstract Background during load */}
      <div className="absolute inset-0 bg-slate-900 flex items-center justify-center -z-10">
         <div className="absolute inset-0 bg-indigo-500/5 blur-[120px] rounded-full animate-pulse" />
         <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-1000">
            <div className="bg-indigo-600/20 p-8 rounded-3xl">
               <GraduationCap className="w-16 h-16 text-indigo-500 animate-bounce" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-widest text-indigo-500/50">SYNCHRONIZING CONTENT...</h3>
         </div>
      </div>

      <video
        ref={videoRef}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onComplete}
        className="w-full h-full object-cover relative z-0"
        src={url}
      />

      {/* Glossy Overlay UI */}
      <div className={cn(
        "absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10",
        !isPlaying && "opacity-100"
      )}>
        {/* Top Info Bar */}
        <div className="absolute top-8 left-8 right-8 flex items-center justify-between pointer-events-none">
           <div className="flex items-center gap-4">
              <Badge className="bg-indigo-600 text-white border-none font-black px-4 h-6 text-[10px] tracking-widest uppercase shadow-lg shadow-indigo-600/20">NOW PLAYING</Badge>
              <h4 className="text-white font-black text-lg uppercase tracking-tight">{title}</h4>
           </div>
           <Button variant="ghost" size="icon" className="rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-slate-950 transition-all pointer-events-auto">
              <Settings className="w-5 h-5" />
           </Button>
        </div>

        {/* Center Play Button (Large) */}
        {!isPlaying && (
          <button 
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-slate-950 p-10 rounded-full shadow-2xl transform hover:scale-110 active:scale-95 transition-all duration-500 group/play"
          >
             <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-30 group-hover/play:opacity-60 transition-opacity" />
             <PlayCircle className="w-16 h-16 relative z-10" />
          </button>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-8 left-8 right-8 space-y-6">
           {/* Progressive Slider */}
           <div className="relative pt-4 group/slider pointer-events-auto">
             <Slider 
                value={[currentTime]}
                max={duration}
                step={0.1}
                onValueChange={(val) => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = val[0];
                    setCurrentTime(val[0]);
                  }
                }}
                className="cursor-pointer"
             />
           </div>

           <div className="flex items-center justify-between gap-8 pointer-events-auto">
              <div className="flex items-center gap-6">
                <button onClick={togglePlay} className="text-white hover:text-indigo-400 transform hover:scale-110 active:scale-90 transition-all">
                  {isPlaying ? <PauseCircle className="w-10 h-10" /> : <PlayCircle className="w-10 h-10" />}
                </button>
                <div className="flex items-center gap-4">
                  <Volume2 className="w-6 h-6 text-white/70" />
                  <span className="text-xs font-black text-white tracking-widest uppercase">{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                 <button className="flex items-center gap-2 px-4 h-10 rounded-full bg-indigo-600/50 hover:bg-indigo-600 text-white backdrop-blur-md border border-white/10 transition-all text-[10px] font-black uppercase tracking-widest">
                    <Zap className="w-4 h-4" /> 1.0x Speed
                 </button>
                 <button className="text-white hover:text-indigo-400 transition-colors">
                    <Maximize2 className="w-6 h-6" />
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Smart Insights Indicator */}
      <div className="absolute top-8 right-24 pointer-events-none group-hover:translate-x-0 translate-x-32 transition-transform duration-700">
         <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl">
               <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">KNOWLEDGE AI</span>
               <span className="text-white text-[9px] font-bold">MONITORING CONTEXT</span>
            </div>
         </div>
      </div>
    </div>
  );
}

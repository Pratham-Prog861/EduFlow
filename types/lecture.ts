import { Id } from "@/convex/_generated/dataModel";

/**
 * EDUFLOW LECTURE STRUCTURE
 * Low-level metadata for educational video assets.
 */

export interface Lecture {
  _id: Id<"lectures">;
  _creationTime: number;
  sectionId: Id<"sections">;
  courseId: Id<"courses">;
  title: string;
  videoUrl: string;
  isPreview: boolean;
  order: number;
  duration?: number; // In seconds
}

export interface LectureMetadata {
  transcript?: string;
  aiKeyTakeaways?: string[];
  resources?: {
    title: string;
    url: string;
  }[];
}

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isReady: boolean;
  hasEnded: boolean;
}

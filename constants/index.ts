/**
 * EDUFLOW GLOBAL CONSTANTS
 * Centralized configuration for the premium educational experience.
 */

export const SITE_CONFIG = {
  name: "eduFlow",
  title: "eduFlow Quantum",
  description: "The next generation of lifelong learning powered by intelligent knowledge synthesis.",
  author: "Pratham",
  url: "https://eduflow.ai",
  version: "3.1.2",
  status: "Operational",
};

export const COURSE_CATEGORIES = [
  { label: "QUANTUM COMPUTING", value: "quantum-computing" },
  { label: "ARTIFICIAL INTELLIGENCE", value: "ai" },
  { label: "CYBER SECURITY", value: "cyber-security" },
  { label: "BLOCKCHAIN ARCHITECTURE", value: "blockchain" },
  { label: "BIOTECHNOLOGY", value: "biotech" },
  { label: "PRODUCT DESIGN", value: "design" },
  { label: "SOFTWARE ENGINEERING", value: "software-engineering" },
  { label: "ENTREPRENEURSHIP", value: "entrepreneurship" },
];

export const NAV_LINKS = {
  public: [
    { label: "CATALOG", href: "/courses" },
    { label: "PHILOSOPHY", href: "/about" },
    { label: "PRICING", href: "/pricing" },
  ],
  dashboard: [
    { label: "OVERVIEW", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "MY COURSES", href: "/student/courses", icon: "BookOpen" },
    { label: "INSTRUCTOR", href: "/instructor/courses", icon: "GraduationCap" },
    { label: "RESOURCES", href: "/resources", icon: "Folder" },
    { label: "SETTINGS", href: "/settings", icon: "Settings" },
  ],
};

export const SOCIAL_LINKS = [
  { label: "TWITTER", href: "https://twitter.com/eduflow", icon: "Twitter" },
  { label: "GITHUB", href: "https://github.com/eduflow", icon: "Github" },
  { label: "LINKEDIN", href: "https://linkedin.com/company/eduflow", icon: "Linkedin" },
];

export const AI_CONFIG = {
  model: "gemini-2.0-flash", // Preferred high-speed model
  system_prompt: `You are an expert educational synthesizer. Your goal is to provide concise, 
  high-impact summaries of educational lecture content. Focus on:
  - Core Knowledge Pillars (Main points)
  - Theoretical Applications (How it's used)
  - Critical Insights (Unique takeaways)
  Format your output in professional, academic paragraphs.`,
};

export const UI_THRESHOLDS = {
  SHIMMER_DURATION: 1500,
  TOAST_DURATION: 3000,
  SKELETON_COUNT: 4,
};

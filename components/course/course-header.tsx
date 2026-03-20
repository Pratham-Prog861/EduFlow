"use client";

import { BookOpen, Search, UserButton } from "@clerk/nextjs";
import { 
  Bell, 
  SearchIcon, 
  Menu, 
  Plus, 
  ChevronRight, 
  Home, 
  GraduationCap, 
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function CourseHeader() {
  const pathname = usePathname();

  return (
    <header className="h-20 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-8 transition-all duration-300">
      <div className="flex items-center gap-10">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-600/20 group-hover:rotate-6 transition-transform">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">eduFlow</span>
        </Link>
        
        {/* Navigation Breadcrumbs */}
        <nav className="hidden md:flex items-center gap-x-2 text-xs font-black uppercase tracking-widest text-slate-400">
          <Link href="/dashboard" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900">
            <Home className="w-3 h-3" /> Dashboard
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="text-indigo-600 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-full border border-indigo-100 dark:border-indigo-900/50">
             Current Page
          </span>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        {/* Global Action Button */}
        <Button className="hidden sm:flex rounded-full bg-slate-900 hover:bg-indigo-600 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-indigo-600 h-10 px-6 font-black uppercase tracking-widest text-[10px] shadow-xl group transition-all">
          <Plus className="w-3 h-3 mr-2 group-hover:rotate-90 transition-transform" /> New Action
        </Button>

        {/* Global Search */}
        <div className="hidden lg:flex items-center relative w-72 group">
          <SearchIcon className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <Input 
            placeholder="Search resources..." 
            className="pl-12 h-11 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border-none focus-visible:ring-1 focus-visible:ring-indigo-600/50 font-bold"
          />
        </div>

        <div className="w-px h-8 bg-slate-100 dark:bg-slate-800 mx-2" />

        <div className="flex items-center gap-4">
           {/* Notifications */}
           <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-slate-50 dark:hover:bg-slate-900 h-10 w-10">
              <Bell className="w-5 h-5 text-slate-500" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white dark:border-slate-950 shadow-sm" />
           </Button>
           
           <UserButton 
            afterSignOutUrl="/"
            appearance={{
                elements: {
                    avatarBox: "w-10 h-10 border-2 border-indigo-50/50 dark:border-indigo-900/50 shadow-sm hover:scale-105 transition-transform"
                }
            }}
           />
        </div>
      </div>
    </header>
  );
}

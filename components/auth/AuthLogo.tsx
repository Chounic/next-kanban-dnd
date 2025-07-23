import { cn } from "@/lib/utils";
import React from "react";

export default function ProjectLogo({ isAuthLogo = false, className }: { isAuthLogo?: boolean; className?: string }) {
  
  return (
    <div className={cn("items-center gap-2 select-none", className)}>
      <svg
        className={cn("size-7 sm:size-9", isAuthLogo && "size-10")}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="3" y="6" width="8" height="24" rx="2" fill="#591ff9"/>
        <rect x="14" y="6" width="8" height="16" rx="2" fill="#A0A3BD"/>
        <rect x="25" y="6" width="8" height="12" rx="2" fill="#e9edf7"/>
      </svg>
      <span className={cn("font-bold text-2xl sm:text-2xl text-grey-900 tracking-tight", isAuthLogo && "hidden sm:inline")}>NexTasks</span>
    </div>
  );
}

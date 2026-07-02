"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const SidebarItem = ({ href, title, icon }: { href: string; title: string; icon: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const selected = pathname === href;

  return (
    <div 
      className={`flex items-center gap-3 cursor-pointer py-3.5 px-4 mx-4 my-1.5 rounded-xl transition-all duration-200 group relative
        ${selected 
          ? "bg-secondaryCyan/10 text-secondaryCyan border border-secondaryCyan/20 font-semibold" 
          : "text-white/60 hover:text-white hover:bg-white/5 hover:translate-x-1"}`}
      onClick={() => {
        router.push(href);
      }}
    >
      {/* Active left indicator glow line */}
      {selected && (
        <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-md bg-secondaryCyan shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
      )}
      
      <div className={`transition-transform duration-200 group-hover:scale-105 ${selected ? "text-secondaryCyan" : "text-white/40 group-hover:text-white/80"}`}>
        {icon}
      </div>
      <div className="font-heading text-sm tracking-wide">
        {title}
      </div>
    </div>
  );
};

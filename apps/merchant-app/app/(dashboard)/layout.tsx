"use client";

import React from "react";
import { SidebarItem } from "../../components/SidebarItem";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="flex min-h-[calc(100vh-73px)] bg-[#051424]">
      {/* Sidebar - glassmorphic border right */}
      <aside className="w-72 border-r border-white/10 bg-[#051424]/40 backdrop-blur-md pt-10 flex flex-col justify-between hidden md:flex">
        <div className="flex-1">
          <div className="px-8 mb-6">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Merchant Hub</span>
          </div>
          <div className="space-y-1">
            <SidebarItem href="/dashboard" icon={<DashboardIcon />} title="Analytics overview" />
            <SidebarItem href="/payments" icon={<PaymentsIcon />} title="Payments ledger" />
            <SidebarItem href="/developer" icon={<DeveloperIcon />} title="Developer tools" />
          </div>
        </div>

        {/* Dynamic decorative glass-card at bottom of sidebar */}
        <div className="p-5 m-4 rounded-2xl glass-card border border-white/5 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-secondaryCyan/10 blur-xl"></div>
          <p className="text-xs font-semibold text-white/80 mb-1">API Documentation</p>
          <p className="text-[10px] text-white/40 mb-3">Integrate payment workflows into your core applications.</p>
          <a href="/developer" className="inline-flex items-center gap-1 text-[10px] text-secondaryCyan font-bold hover:underline">
            View API docs <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#051424]/90 backdrop-blur-lg border-t border-white/10 flex justify-around py-3 md:hidden">
        <MobileNavItem href="/dashboard" icon={<DashboardIcon />} title="Analytics" />
        <MobileNavItem href="/payments" icon={<PaymentsIcon />} title="Payments" />
        <MobileNavItem href="/developer" icon={<DeveloperIcon />} title="Developer" />
      </nav>
    </div>
  );
}

function MobileNavItem({ href, icon, title }: { href: string; icon: React.ReactNode; title: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const selected = pathname === href;

  return (
    <button 
      onClick={() => router.push(href)}
      className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all duration-200
        ${selected ? "text-secondaryCyan" : "text-white/40"}`}
    >
      <div className={`transition-transform duration-200 ${selected ? "scale-110" : ""}`}>
        {icon}
      </div>
      <span>{title}</span>
    </button>
  );
}

// Custom Premium SVG Icons

function DashboardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  );
}

function PaymentsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
    </svg>
  );
}

function DeveloperIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
    </svg>
  );
}

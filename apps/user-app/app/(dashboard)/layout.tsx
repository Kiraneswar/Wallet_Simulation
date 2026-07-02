"use client"
import React from "react";
import { SidebarItem } from "../../components/SidebarItem";
import { usePathname, useRouter } from "next/navigation";

export default function Layout({
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
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Main Menu</span>
          </div>
          <div className="space-y-1">
            <SidebarItem href="/dashboard" icon={<HomeIcon />} title="Dashboard" />
            <SidebarItem href="/transfer" icon={<TransferIcon />} title="Transfer Funds" />
            <SidebarItem href="/transactions" icon={<TransactionsIcon />} title="Ledger & Activity" />
            <SidebarItem href="/p2p" icon={<P2PTransfer />} title="P2P Transfer" />
          </div>
        </div>

        {/* Dynamic decorative glass-card at bottom of sidebar */}
        <div className="p-5 m-4 rounded-2xl glass-card border border-white/5 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-[#adc7ff]/10 blur-xl"></div>
          <p className="text-xs font-semibold text-white/80 mb-1">Need help?</p>
          <p className="text-[10px] text-white/40 mb-3">View our premium support documentation.</p>
          <a href="#" className="inline-flex items-center gap-1 text-[10px] text-[#adc7ff] font-bold hover:underline">
            Support Center <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#051424]/90 backdrop-blur-lg border-t border-white/10 flex justify-around py-3 md:hidden">
        <MobileNavItem href="/dashboard" icon={<HomeIcon />} title="Dashboard" />
        <MobileNavItem href="/transfer" icon={<TransferIcon />} title="Transfer" />
        <MobileNavItem href="/transactions" icon={<TransactionsIcon />} title="Ledger" />
        <MobileNavItem href="/p2p" icon={<P2PTransfer />} title="P2P" />
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
        ${selected ? "text-[#adc7ff]" : "text-white/40"}`}
    >
      <div className={`transition-transform duration-200 ${selected ? "scale-110" : ""}`}>
        {icon}
      </div>
      <span>{title}</span>
    </button>
  );
}

// Icons Fetched from https://heroicons.com/

function P2PTransfer() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function TransferIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  );
}

function TransactionsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}
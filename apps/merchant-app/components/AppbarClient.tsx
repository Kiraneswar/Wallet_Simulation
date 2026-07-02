"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AppbarClient() {
  const session = useSession();
  const router = useRouter();
  const user = session.data?.user;

  return (
    <header className="sticky top-0 z-50 w-full px-6 py-4 backdrop-blur-md bg-[#051424]/60 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/dashboard")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#06b6d4] to-[#3b82f6] flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <span className="material-symbols-outlined text-[#051424] font-bold">storefront</span>
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg text-white leading-none tracking-tight">Elite Merchant</h1>
            <span className="text-[10px] text-secondaryCyan font-semibold uppercase tracking-wider">Institutional Gateway</span>
          </div>
        </div>

        {/* Center section: Search box */}
        {user && (
          <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 w-80 focus-within:border-secondaryCyan/50 transition-all">
            <span className="material-symbols-outlined text-white/40 text-sm">search</span>
            <input 
              type="text" 
              placeholder="Search incoming transfers, customers..." 
              className="bg-transparent border-none text-white text-xs placeholder-white/30 focus:outline-none w-full"
            />
            <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-white/50 font-mono">⌘K</span>
          </div>
        )}

        {/* Right section: Profile & actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Notification icon */}
              <button className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/80 hover:text-white">
                <span className="material-symbols-outlined text-xl">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondaryCyan status-pulse"></span>
              </button>

              {/* User profile card */}
              <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-white leading-tight">{user.name || "Merchant"}</p>
                  <p className="text-xs text-white/50">{user.email || ""}</p>
                </div>
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-secondaryCyan/20 border border-secondaryCyan/40 flex items-center justify-center font-bold text-secondaryCyan text-sm">
                  {user.name ? user.name[0]?.toUpperCase() : "M"}
                </div>
                
                {/* Logout action */}
                <button 
                  onClick={async () => {
                    await signOut();
                    router.push("/api/auth/signin");
                  }} 
                  className="w-10 h-10 rounded-xl bg-errorRose/10 border border-errorRose/20 text-errorRose flex items-center justify-center hover:bg-errorRose/20 transition-all"
                  title="Sign Out"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={() => signIn()} 
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] text-white font-semibold hover:opacity-90 transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)]"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

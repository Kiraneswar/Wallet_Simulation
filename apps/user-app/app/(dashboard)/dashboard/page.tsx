import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { QuickTransfer } from "../../../components/QuickTransfer";
import React from "react";
import { redirect } from "next/navigation";

async function getBalance(userId: number) {
  const balance = await prisma.balance.findFirst({
    where: {
      userId: userId,
    },
  });
  return {
    amount: balance?.amount || 0,
    locked: balance?.locked || 0,
  };
}

async function getRecentActivity(userId: number) {
  // Get latest 5 on-ramp transactions
  const onRamp = await prisma.onRampTransaction.findMany({
    where: { userId },
    orderBy: { startTime: "desc" },
    take: 5,
  });

  // Get latest 5 sent transfers
  const p2pSent = await prisma.p2pTransfer.findMany({
    where: { fromUserId: userId },
    include: { toUser: true },
    orderBy: { timestamp: "desc" },
    take: 5,
  });

  // Get latest 5 received transfers
  const p2pRecv = await prisma.p2pTransfer.findMany({
    where: { toUserId: userId },
    include: { fromUser: true },
    orderBy: { timestamp: "desc" },
    take: 5,
  });

  // Map to common structure
  const activities = [
    ...onRamp.map((t) => ({
      id: `onramp-${t.id}`,
      type: "deposit",
      title: `Deposit via ${t.provider}`,
      amount: t.amount,
      time: t.startTime,
      status: t.status, // Success, Failure, Processing
    })),
    ...p2pSent.map((t) => ({
      id: `p2psent-${t.id}`,
      type: "p2p_sent",
      title: `To: ${t.toUser?.name || t.toUser?.number || "Anonymous User"}`,
      amount: -t.amount,
      time: t.timestamp,
      status: "Success",
    })),
    ...p2pRecv.map((t) => ({
      id: `p2precv-${t.id}`,
      type: "p2p_received",
      title: `From: ${t.fromUser?.name || t.fromUser?.number || "Anonymous User"}`,
      amount: t.amount,
      time: t.timestamp,
      status: "Success",
    })),
  ];

  // Sort chronologically descending
  return activities.sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5);
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/api/auth/signin");
  }
  const userId = Number(session.user.id);
  const balance = await getBalance(userId);
  const activities = await getRecentActivity(userId);

  const totalBalance = (balance.amount + balance.locked) / 100;
  const unlockedBalance = balance.amount / 100;
  const lockedBalance = balance.locked / 100;

  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-extrabold text-3xl text-white tracking-tight leading-tight">
            Dashboard
          </h2>
          <p className="text-white/50 text-sm mt-1">
            Welcome back, {session?.user?.name || "User"}. Here is your financial overview.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-semibold backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3] status-pulse"></span>
          <span className="text-white/80">API System Online</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Balance & Analytics Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Balance card */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute right-0 top-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-[#adc7ff]/5 blur-3xl"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1">
                  Total Wallet Balance
                </p>
                <h3 className="font-heading font-extrabold text-4xl text-[#adc7ff] tracking-tight">
                  ₹{totalBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </h3>
              </div>
              <span className="material-symbols-outlined text-[#adc7ff]/60 text-3xl">
                payments
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
              <div className="border-r border-white/10 pr-4">
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1">
                  Unlocked Balance
                </p>
                <p className="text-lg font-bold text-[#ddfcff]">
                  ₹{unlockedBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="pl-4">
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-1">
                  Locked Balance
                </p>
                <p className="text-lg font-bold text-white/60">
                  ₹{lockedBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* SVG Line Chart Card */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 relative">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="font-heading font-bold text-base text-white">Balance Analytics</h4>
                <p className="text-xs text-white/45">Visual balance trend over the last 7 days</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[#adc7ff]"></span>
                Growth
              </div>
            </div>

            {/* Glowing SVG Chart */}
            <div className="relative w-full overflow-hidden">
              <svg viewBox="0 0 500 180" className="w-full h-44 overflow-visible">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#adc7ff" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#adc7ff" stopOpacity="0" />
                  </linearGradient>
                  <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#adc7ff" floodOpacity="0.4" />
                  </filter>
                </defs>
                {/* Horizontal grid lines */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
                
                {/* Gradient area */}
                <path d="M 0 150 Q 75 130 150 140 T 300 80 T 450 60 L 500 50 L 500 180 L 0 180 Z" fill="url(#chartGradient)" />
                
                {/* Curved Line */}
                <path d="M 0 150 Q 75 130 150 140 T 300 80 T 450 60 L 500 50" fill="none" stroke="#adc7ff" strokeWidth="3" filter="url(#glow)" />
                
                {/* Points */}
                <circle cx="150" cy="140" r="4.5" fill="#ddfcff" stroke="#051424" strokeWidth="1.5" />
                <circle cx="300" cy="80" r="4.5" fill="#ddfcff" stroke="#051424" strokeWidth="1.5" />
                <circle cx="450" cy="60" r="4.5" fill="#ddfcff" stroke="#051424" strokeWidth="1.5" />
              </svg>
            </div>
            
            {/* Chart X Labels */}
            <div className="flex justify-between items-center text-[10px] text-white/30 font-semibold uppercase tracking-wider px-2 pt-4">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Transfer & Recent Activity Ledger */}
        <div className="space-y-6 flex flex-col justify-between">
          <QuickTransfer />

          {/* Activity Ledger Card */}
          <div className="glass-card p-6 rounded-2xl border border-white/10 flex-1 flex flex-col justify-between mt-0">
            <div>
              <h4 className="font-heading font-bold text-base text-white mb-1">Recent Activity</h4>
              <p className="text-xs text-white/50 mb-4">Latest updates on your account transactions</p>

              {activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-white/30">
                  <span className="material-symbols-outlined text-3xl mb-2">inbox</span>
                  <p className="text-xs">No recent transactions</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {activities.map((act) => {
                    const isPositive = act.amount > 0;
                    const displayAmt = Math.abs(act.amount / 100);
                    
                    return (
                      <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          {/* Transaction Type Icon */}
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            act.type === "deposit"
                              ? "bg-[#4edea3]/10 text-[#4edea3]"
                              : act.type === "p2p_sent"
                              ? "bg-[#ffb4ab]/10 text-[#ffb4ab]"
                              : "bg-[#adc7ff]/10 text-[#adc7ff]"
                          }`}>
                            <span className="material-symbols-outlined text-sm">
                              {act.type === "deposit"
                                ? "add_circle"
                                : act.type === "p2p_sent"
                                ? "arrow_outward"
                                : "arrow_downward"}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-white/90">{act.title}</p>
                            <p className="text-[10px] text-white/40">
                              {act.time.toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className={`font-bold ${isPositive ? "text-[#4edea3]" : "text-white/80"}`}>
                            {isPositive ? "+" : "-"}₹{displayAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold tracking-wider ${
                            act.status === "Success"
                              ? "bg-[#4edea3]/10 text-[#4edea3]"
                              : act.status === "Processing"
                              ? "bg-amber-400/10 text-amber-400"
                              : "bg-[#ffb4ab]/10 text-[#ffb4ab]"
                          }`}>
                            {act.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-4 border-t border-white/5 pt-4">
              <a 
                href="/transactions" 
                className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 font-bold text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-1.5"
              >
                <span>View Full Ledger</span>
                <span className="material-symbols-outlined text-xs">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
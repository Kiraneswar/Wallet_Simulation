import { getServerSession } from "next-auth";
import { SendCard } from "../../../components/SendCars";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { BalanceCard } from "../../../components/BalanceCard";
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

async function getp2ptransfers(userId: number) {
  const txns = await prisma.p2pTransfer.findMany({
    where: {
      OR: [
        { fromUserId: userId },
        { toUserId: userId }
      ]
    },
    include: {
      fromUser: true,
      toUser: true
    },
    orderBy: {
      timestamp: "desc",
    },
    take: 5
  });

  return txns.map((t) => ({
    time: t.timestamp,
    amount: t.amount,
    fromUserId: t.fromUserId,
    toUserId: t.toUserId,
    fromUserName: t.fromUser?.name || t.fromUser?.number,
    toUserName: t.toUser?.name || t.toUser?.number
  }));
}

export default async function P2PPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/api/auth/signin");
  }
  const userId = Number(session.user.id);
  const balance = await getBalance(userId);
  const transactions = await getp2ptransfers(userId);

  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="font-heading font-extrabold text-3xl text-white tracking-tight leading-none">
          P2P Transfer
        </h2>
        <p className="text-white/50 text-sm mt-2">
          Transfer money instantly to other users by entering their phone number.
        </p>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <SendCard />
        </div>
        <div className="space-y-6">
          <BalanceCard amount={balance.amount} locked={balance.locked} />
          
          {/* P2P transfers list */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 relative space-y-4">
            <h4 className="font-heading font-bold text-base text-white">Recent Transfers</h4>
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-white/30 text-xs">
                No recent transfers
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {transactions.map((t, idx) => {
                  const isSent = t.fromUserId === userId;
                  const displayName = isSent ? `To: ${t.toUserName}` : `From: ${t.fromUserName}`;
                  const displayAmt = t.amount / 100;
                  
                  return (
                    <div key={idx} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0 text-xs">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSent ? "bg-[#ffb4ab]/10 text-[#ffb4ab]" : "bg-[#4edea3]/10 text-[#4edea3]"
                        }`}>
                          <span className="material-symbols-outlined text-sm">
                            {isSent ? "arrow_outward" : "arrow_downward"}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-white/90">{displayName}</p>
                          <p className="text-[10px] text-white/40">
                            {t.time.toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${isSent ? "text-white/80" : "text-[#4edea3]"}`}>
                          {isSent ? "-" : "+"}₹{displayAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </p>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#4edea3]/10 text-[#4edea3] font-semibold uppercase tracking-wider">
                          Success
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
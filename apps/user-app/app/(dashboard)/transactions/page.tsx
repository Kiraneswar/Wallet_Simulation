import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { LedgerView } from "../../../components/LedgerView";
import React from "react";
import { redirect } from "next/navigation";

async function getTransactions(userId: number) {
  const onRamp = await prisma.onRampTransaction.findMany({
    where: { userId },
    orderBy: { startTime: "desc" }
  });

  const p2pSent = await prisma.p2pTransfer.findMany({
    where: { fromUserId: userId },
    include: { toUser: true },
    orderBy: { timestamp: "desc" }
  });

  const p2pRecv = await prisma.p2pTransfer.findMany({
    where: { toUserId: userId },
    include: { fromUser: true },
    orderBy: { timestamp: "desc" }
  });

  const txns = [
    ...onRamp.map((t) => ({
      id: `onramp-${t.id}`,
      type: "deposit",
      title: `Deposit via ${t.provider}`,
      amount: t.amount,
      time: t.startTime.toISOString(),
      status: t.status,
      reference: t.provider,
    })),
    ...p2pSent.map((t) => ({
      id: `p2psent-${t.id}`,
      type: "sent",
      title: `Transfer to ${t.toUser?.name || t.toUser?.number || "Anonymous User"}`,
      amount: -t.amount,
      time: t.timestamp.toISOString(),
      status: "Success",
      reference: t.toUser?.number || "",
    })),
    ...p2pRecv.map((t) => ({
      id: `p2precv-${t.id}`,
      type: "received",
      title: `Transfer from ${t.fromUser?.name || t.fromUser?.number || "Anonymous User"}`,
      amount: t.amount,
      time: t.timestamp.toISOString(),
      status: "Success",
      reference: t.fromUser?.number || "",
    }))
  ];

  // Sort chronologically descending
  return txns.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
}

export default async function TransactionsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/api/auth/signin");
  }
  const userId = Number(session.user.id);
  const transactions = await getTransactions(userId);

  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto">
      <div>
        <h2 className="font-heading font-extrabold text-3xl text-white tracking-tight leading-none">
          Activity Ledger
        </h2>
        <p className="text-white/50 text-sm mt-2">
          View and audit your full transaction log. Search, filter, and track payments.
        </p>
      </div>

      <LedgerView initialTransactions={transactions} />
    </div>
  );
}
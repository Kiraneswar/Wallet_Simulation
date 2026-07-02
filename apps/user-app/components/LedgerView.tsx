"use client"
import React, { useState } from "react";

export interface Transaction {
  id: string;
  type: string; // "deposit" | "sent" | "received"
  title: string;
  amount: number;
  time: string;
  status: string;
  reference: string;
}

interface LedgerViewProps {
  initialTransactions: Transaction[];
}

type TabType = "all" | "deposit" | "sent" | "received";

export function LedgerView({ initialTransactions }: LedgerViewProps) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<TabType>("all");

  const filtered = initialTransactions.filter((tx) => {
    // Filter by tab type
    if (tab !== "all" && tx.type !== tab) {
      return false;
    }
    // Filter by search query (case-insensitive title or reference or amount)
    if (search) {
      const query = search.toLowerCase();
      const matchTitle = tx.title.toLowerCase().includes(query);
      const matchRef = tx.reference.toLowerCase().includes(query);
      const amtStr = (Math.abs(tx.amount) / 100).toString();
      const matchAmt = amtStr.includes(query);
      return matchTitle || matchRef || matchAmt;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters panel */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Category filtering tabs */}
        <div className="bg-white/5 border border-white/10 p-1 rounded-xl flex gap-1.5 w-full sm:w-auto">
          {(["all", "deposit", "sent", "received"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all
                ${tab === t 
                  ? "bg-[#adc7ff]/15 text-[#adc7ff] border border-[#adc7ff]/20 font-bold" 
                  : "text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent"}`}
            >
              {t === "deposit" ? "Deposits" : t === "sent" ? "Sent" : t === "received" ? "Received" : "All"}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex items-center w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 text-white/30 text-sm">
            search
          </span>
          <input
            type="text"
            placeholder="Search details or amount..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl input-recessed text-xs font-medium"
          />
          {search && (
            <button 
              onClick={() => setSearch("")}
              className="absolute right-3 text-white/40 hover:text-white text-xs font-semibold font-mono"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Ledger List */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-[#adc7ff]/5 blur-3xl"></div>
        
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-white/35 flex flex-col items-center justify-center space-y-3">
            <span className="material-symbols-outlined text-4xl">receipt_long</span>
            <p className="text-sm font-semibold">No records match your filters</p>
            <p className="text-xs text-white/20">Try clearing your search query or selecting another category.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40 uppercase tracking-widest font-bold font-heading">
                  <th className="pb-4 pl-2">Type</th>
                  <th className="pb-4">Details</th>
                  <th className="pb-4 hidden sm:table-cell">Reference</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right pr-2">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((tx) => {
                  const isSuccess = tx.status === "Success";
                  const isProcessing = tx.status === "Processing";
                  const isPositive = tx.amount > 0;
                  const displayAmt = Math.abs(tx.amount / 100);

                  return (
                    <tr key={tx.id} className="hover:bg-white/2 transition-colors group">
                      {/* Type icon column */}
                      <td className="py-4 pl-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          tx.type === "deposit"
                            ? "bg-[#4edea3]/10 text-[#4edea3]"
                            : tx.type === "sent"
                            ? "bg-[#ffb4ab]/10 text-[#ffb4ab]"
                            : "bg-[#adc7ff]/10 text-[#adc7ff]"
                        }`}>
                          <span className="material-symbols-outlined text-sm">
                            {tx.type === "deposit"
                              ? "add_circle"
                              : tx.type === "sent"
                              ? "arrow_outward"
                              : "arrow_downward"}
                          </span>
                        </div>
                      </td>

                      {/* Details (Title) */}
                      <td className="py-4 font-semibold text-white/90 pr-4">
                        {tx.title}
                      </td>

                      {/* Reference Column */}
                      <td className="py-4 text-white/50 hidden sm:table-cell">
                        {tx.reference || "—"}
                      </td>

                      {/* Date Column */}
                      <td className="py-4 text-white/40 font-medium">
                        {new Date(tx.time).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* Status Column */}
                      <td className="py-4">
                        <span className={`text-[9px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${
                          isSuccess 
                            ? "bg-[#4edea3]/10 text-[#4edea3]" 
                            : isProcessing 
                            ? "bg-amber-400/10 text-amber-400 status-pulse" 
                            : "bg-[#ffb4ab]/10 text-[#ffb4ab]"
                        }`}>
                          {tx.status}
                        </span>
                      </td>

                      {/* Amount Column */}
                      <td className={`py-4 text-right font-bold pr-2 font-mono text-sm ${
                        isPositive ? "text-[#4edea3]" : "text-white/80"
                      }`}>
                        {isPositive ? "+" : "-"}₹{displayAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

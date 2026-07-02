import React from "react";

export const OnRampTransactions = ({
  transactions,
}: {
  transactions: {
    time: Date;
    amount: number;
    status: string; // Success, Processing, Failure
    provider: string;
  }[];
}) => {
  if (!transactions.length) {
    return (
      <div className="glass-card p-6 rounded-3xl border border-white/10 relative">
        <h4 className="font-heading font-bold text-base text-white mb-4">Recent Deposits</h4>
        <div className="text-center py-8 text-white/30 text-xs">
          No recent deposits
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-3xl border border-white/10 relative">
      <h4 className="font-heading font-bold text-base text-white mb-4">Recent Deposits</h4>
      
      <div className="divide-y divide-white/5">
        {transactions.slice(0, 5).map((t, idx) => {
          const isSuccess = t.status === "Success";
          const isProcessing = t.status === "Processing";

          return (
            <div key={idx} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0 text-xs">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isSuccess 
                    ? "bg-[#4edea3]/10 text-[#4edea3]" 
                    : isProcessing 
                    ? "bg-amber-400/10 text-amber-400" 
                    : "bg-[#ffb4ab]/10 text-[#ffb4ab]"
                }`}>
                  <span className="material-symbols-outlined text-sm">
                    {isSuccess ? "check_circle" : isProcessing ? "sync" : "error"}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-white/90">via {t.provider}</p>
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
                <p className="font-bold text-white">
                  +₹{(t.amount / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider ${
                  isSuccess 
                    ? "bg-[#4edea3]/10 text-[#4edea3]" 
                    : isProcessing 
                    ? "bg-amber-400/10 text-amber-400 status-pulse" 
                    : "bg-[#ffb4ab]/10 text-[#ffb4ab]"
                }`}>
                  {t.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
import React from "react";

export const BalanceCard = ({ amount, locked }: { amount: number; locked: number }) => {
  const unlockedBal = amount / 100;
  const lockedBal = locked / 100;
  const totalBal = (amount + locked) / 100;

  return (
    <div className="glass-card p-6 rounded-3xl border border-white/10 relative overflow-hidden space-y-4">
      <div className="absolute right-0 top-0 -mr-16 -mt-16 w-40 h-40 rounded-full bg-[#adc7ff]/5 blur-2xl"></div>
      
      <div>
        <h4 className="font-heading font-bold text-base text-white">Wallet Balance</h4>
        <p className="text-xs text-white/50">Current wallet balance breakdown.</p>
      </div>

      <div className="space-y-3.5 border-t border-white/5 pt-4">
        {/* Unlocked */}
        <div className="flex justify-between items-center text-xs">
          <span className="text-white/60 font-medium">Unlocked Balance</span>
          <span className="font-mono font-bold text-white/95">
            ₹{unlockedBal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Locked */}
        <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3.5">
          <span className="text-white/40 font-medium">Locked Balance</span>
          <span className="font-mono font-bold text-white/50">
            ₹{lockedBal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center text-sm border-t border-white/10 pt-3.5 font-semibold">
          <span className="text-white/80 font-bold">Total Balance</span>
          <span className="font-mono font-black text-[#adc7ff] text-base">
            ₹{totalBal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
};
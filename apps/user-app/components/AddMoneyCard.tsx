"use client"
import { useState } from "react";
import { createOnRamptransaction } from "../app/lib/actions/createOnRamptxn";
import { SavedCards } from "./SavedCards";

const SUPPORTED_BANKS = [
  {
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com",
  },
  {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/",
  },
  {
    name: "Antigravity Bank",
    redirectUrl: "https://antigravity.dev",
  }
];

export const AddMoney = () => {
  const [amount, setAmount] = useState<string>("");
  const [provider, setProvider] = useState(SUPPORTED_BANKS[0]!.name);
  const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]!.redirectUrl);
  const [loading, setLoading] = useState(false);

  const handleSelectBank = (bankName: string) => {
    const bank = SUPPORTED_BANKS.find(b => b.name === bankName) || SUPPORTED_BANKS[0]!;
    setProvider(bank.name);
    setRedirectUrl(bank.redirectUrl);
  };

  const handleAddMoney = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    setLoading(true);
    try {
      // Amount is converted to paise (amount * 100) before creating transaction
      await createOnRamptransaction(Number(amount) * 100, provider);
      window.location.href = redirectUrl;
    } catch (e) {
      console.error(e);
      alert("Failed to process transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden space-y-6">
      <div className="absolute right-0 top-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-[#adc7ff]/5 blur-3xl"></div>
      
      <div>
        <h3 className="font-heading font-bold text-lg text-white">Add Funds</h3>
        <p className="text-xs text-white/50">Top up your wallet balance instantly.</p>
      </div>

      {/* Recessed Input for INR Amount */}
      <div>
        <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block mb-1.5">
          Amount (INR)
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-white/40 text-sm font-semibold">₹</span>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full pl-7 pr-4 py-2.5 rounded-xl input-recessed text-sm font-mono font-semibold"
          />
        </div>
      </div>

      {/* Saved Cards Slider */}
      <SavedCards onSelectCard={handleSelectBank} selectedBank={provider} />

      {/* Bank Dropdown */}
      <div>
        <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block mb-1.5">
          Or Select Net Banking Provider
        </label>
        <select
          value={provider}
          onChange={(e) => handleSelectBank(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl input-recessed text-sm font-medium focus:ring-1 focus:ring-[#adc7ff]/30 cursor-pointer"
        >
          {SUPPORTED_BANKS.map((bank) => (
            <option key={bank.name} value={bank.name} className="bg-[#051424] text-white">
              {bank.name}
            </option>
          ))}
        </select>
      </div>

      {/* Button CTA */}
      <button
        onClick={handleAddMoney}
        disabled={loading || !amount}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#adc7ff] to-[#ddfcff] text-[#051424] font-bold text-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 primary-glow-hover disabled:opacity-50"
      >
        {loading ? (
          <span className="status-pulse">Initiating net banking...</span>
        ) : (
          <>
            <span>Add Funds</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </>
        )}
      </button>
    </div>
  );
};
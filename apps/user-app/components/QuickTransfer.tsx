"use client"
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2ptranser";

export function QuickTransfer() {
    const [phone, setPhone] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleSend = async () => {
        if (!phone || !amount) {
            setStatus({ type: "error", message: "Please fill in all fields" });
            return;
        }
        setLoading(true);
        setStatus(null);
        try {
            // Amount is in paise, so we multiply the user input by 100
            const res = await p2pTransfer(phone, Number(amount) * 100);
            if (res?.message) {
                setStatus({ type: "error", message: res.message });
            } else {
                setStatus({ type: "success", message: "Transfer successful!" });
                setPhone("");
                setAmount("");
                // Refresh the page to update the balance
                window.location.reload();
            }
        } catch (e: any) {
            setStatus({ type: "error", message: e.message || "An unexpected error occurred" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col h-full justify-between">
            <div>
                <h3 className="font-heading font-bold text-base text-white mb-1">Quick Send</h3>
                <p className="text-xs text-white/50 mb-6">Instantly transfer funds to anyone on P2P Pay.</p>
                
                <div className="space-y-4">
                    {/* Recipient Phone input */}
                    <div className="relative">
                        <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block mb-1">Recipient Phone</label>
                        <div className="relative flex items-center">
                            <span className="material-symbols-outlined absolute left-3 text-white/30 text-sm">phone_iphone</span>
                            <input 
                                type="text"
                                placeholder="Enter phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl input-recessed text-sm font-medium"
                            />
                        </div>
                    </div>

                    {/* Amount input */}
                    <div>
                        <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block mb-1">Amount (INR)</label>
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
                </div>
            </div>

            <div className="mt-6">
                {status && (
                    <div className={`p-3 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2 border ${
                        status.type === "success" 
                            ? "bg-[#4edea3]/10 border-[#4edea3]/30 text-[#4edea3]" 
                            : "bg-[#ffb4ab]/10 border-[#ffb4ab]/30 text-[#ffb4ab]"
                    }`}>
                        <span className="material-symbols-outlined text-sm">
                            {status.type === "success" ? "check_circle" : "error"}
                        </span>
                        {status.message}
                    </div>
                )}

                <button 
                    onClick={handleSend}
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#adc7ff] to-[#ddfcff] text-[#051424] font-bold text-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 primary-glow-hover disabled:opacity-50"
                >
                    {loading ? (
                        <span className="status-pulse">Processing...</span>
                    ) : (
                        <>
                            <span>Send Funds</span>
                            <span className="material-symbols-outlined text-sm">send</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

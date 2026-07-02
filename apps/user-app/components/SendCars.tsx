"use client"
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2ptranser";

export function SendCard() {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState<{ show: boolean; success: boolean; message: string } | null>(null);

    const handleSend = async () => {
        if (!number || !amount || Number(amount) <= 0) {
            setModal({ show: true, success: false, message: "Please enter a valid phone number and amount" });
            return;
        }
        setLoading(true);
        try {
            // Amount is in paise, so we multiply by 100
            const res = await p2pTransfer(number, Number(amount) * 100);
            if (res?.message) {
                setModal({ show: true, success: false, message: res.message });
            } else {
                setModal({ 
                    show: true, 
                    success: true, 
                    message: `Successfully transferred ₹${Number(amount).toFixed(2)} to ${number}.`
                });
                setNumber("");
                setAmount("");
            }
        } catch (e: any) {
            setModal({ show: true, success: false, message: e.message || "An unexpected error occurred" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden space-y-6">
            <div className="absolute right-0 top-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-[#adc7ff]/5 blur-3xl"></div>
            
            <div>
                <h3 className="font-heading font-bold text-lg text-white">Send Money</h3>
                <p className="text-xs text-white/50">Transfer funds instantly to friends or family.</p>
            </div>

            <div className="space-y-4">
                {/* Phone Number Input */}
                <div>
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block mb-1.5">
                        Recipient Phone Number
                    </label>
                    <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3 text-white/30 text-sm">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Enter phone number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl input-recessed text-sm font-medium"
                        />
                    </div>
                </div>

                {/* Amount Input */}
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
            </div>

            {/* Send CTA Button */}
            <button
                onClick={handleSend}
                disabled={loading || !number || !amount}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#adc7ff] to-[#ddfcff] text-[#051424] font-bold text-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 primary-glow-hover disabled:opacity-50"
            >
                {loading ? (
                    <span className="status-pulse">Sending...</span>
                ) : (
                    <>
                        <span>Send Money</span>
                        <span className="material-symbols-outlined text-sm">send</span>
                    </>
                )}
            </button>

            {/* Confirmation Modal */}
            {modal && modal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#051424]/85 backdrop-blur-md p-4">
                    <div className="glass-panel max-w-sm w-full p-6 rounded-3xl border border-white/10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                            modal.success ? "bg-[#4edea3]/10 text-[#4edea3]" : "bg-[#ffb4ab]/10 text-[#ffb4ab]"
                        }`}>
                            <span className="material-symbols-outlined text-4xl">
                                {modal.success ? "check_circle" : "error"}
                            </span>
                        </div>
                        
                        <div>
                            <h4 className="font-heading font-extrabold text-xl text-white">
                                {modal.success ? "Transfer Sent" : "Transfer Failed"}
                            </h4>
                            <p className="text-xs text-white/50 mt-2 leading-relaxed">{modal.message}</p>
                        </div>

                        <button 
                            onClick={() => {
                                setModal(null);
                                if (modal.success) {
                                    window.location.reload();
                                }
                            }}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#adc7ff] to-[#ddfcff] text-[#051424] font-bold text-sm hover:opacity-95 transition-all primary-glow"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
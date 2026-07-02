"use client";

import { useState } from "react";

export default function DeveloperPage() {
  // Credentials state
  const [showSecret, setShowSecret] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Webhook sandbox inputs
  const [userId, setUserId] = useState("1");
  const [amount, setAmount] = useState("500");
  const [token, setToken] = useState("");
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<{
    success: boolean;
    message: string;
    detail?: string;
  } | null>(null);

  // Credentials config
  const credentials = {
    clientId: "yourID",
    clientSecret: "yoursecret",
    webhookSecret: "yoursecret",
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const generateRandomToken = () => {
    const randomHex = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    setToken(`token_${randomHex}`);
  };

  const handleTriggerWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !userId || !amount) {
      setSandboxResult({
        success: false,
        message: "Validation Error",
        detail: "Please fill in all sandbox parameters (User ID, Amount, Token).",
      });
      return;
    }

    setSandboxLoading(true);
    setSandboxResult(null);

    try {
      const response = await fetch("/api/webhook-tester", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          userId: parseInt(userId, 10),
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSandboxResult({
          success: true,
          message: "Transaction Captured!",
          detail: `Status Code: 200 OK. Successfully credited User #${userId} with ${amount} units. Transaction token "${token}" is now marked Success in the DB. Check the User App balance!`,
        });
      } else {
        setSandboxResult({
          success: false,
          message: "Processor Rejected Request",
          detail: data.error || "Ensure that the bank-webhook server is running on port 3003.",
        });
      }
    } catch (err: any) {
      console.error(err);
      setSandboxResult({
        success: false,
        message: "Network Error",
        detail: "Could not establish connection with webhook proxy. Please check console logs.",
      });
    } finally {
      setSandboxLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Developer Integrations</h1>
        <p className="mt-1 text-sm text-[#adc7ff]/60">
          Manage API keys, configure endpoints, and run sandboxed tests of the payment processing pipelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Keys & Configuration */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* API Keys Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">API Credentials</h3>
              <p className="text-xs text-white/40">Use these secrets to authenticate programmatic payments.</p>
            </div>

            <div className="space-y-4">
              {/* Client ID */}
              <div>
                <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                  Client ID
                </label>
                <div className="flex gap-2">
                  <div className="input-recessed flex-1 font-mono text-xs py-3 px-4 rounded-xl select-all break-all flex items-center">
                    {credentials.clientId}
                  </div>
                  <button
                    onClick={() => handleCopy(credentials.clientId, "clientId")}
                    className="px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {copiedField === "clientId" ? "check" : "content_copy"}
                    </span>
                    <span>{copiedField === "clientId" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Client Secret */}
              <div>
                <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                  Client Secret
                </label>
                <div className="flex gap-2">
                  <div className="input-recessed flex-1 font-mono text-xs py-3 px-4 rounded-xl select-all break-all flex items-center justify-between">
                    <span>
                      {showSecret ? credentials.clientSecret : "••••••••••••••••••••••••••••••••••••••••"}
                    </span>
                    <button 
                      onClick={() => setShowSecret(!showSecret)}
                      className="text-white/40 hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">
                        {showSecret ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  <button
                    onClick={() => handleCopy(credentials.clientSecret, "clientSecret")}
                    className="px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {copiedField === "clientSecret" ? "check" : "content_copy"}
                    </span>
                    <span>{copiedField === "clientSecret" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Webhook Secret */}
              <div>
                <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                  Webhook Secret Signature
                </label>
                <div className="flex gap-2">
                  <div className="input-recessed flex-1 font-mono text-xs py-3 px-4 rounded-xl select-all break-all flex items-center">
                    {credentials.webhookSecret}
                  </div>
                  <button
                    onClick={() => handleCopy(credentials.webhookSecret, "webhookSecret")}
                    className="px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {copiedField === "webhookSecret" ? "check" : "content_copy"}
                    </span>
                    <span>{copiedField === "webhookSecret" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Webhook Configuration Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Endpoint URL</h3>
              <p className="text-xs text-white/40">Enter the destination URL to receive transaction status notifications.</p>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#adc7ff]/40">
                  <span className="material-symbols-outlined text-lg">link</span>
                </span>
                <input
                  type="text"
                  defaultValue="https://api.business.com/v1/payments/webhook"
                  className="input-recessed block w-full pl-10 pr-3 py-3 rounded-xl text-xs"
                  placeholder="https://"
                  readOnly
                />
              </div>
              <button className="px-4 bg-secondaryCyan/10 border border-secondaryCyan/20 text-secondaryCyan hover:bg-secondaryCyan/20 rounded-xl text-xs font-bold transition-all cursor-pointer">
                Modify
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Webhook Simulator */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-secondaryCyan text-lg">terminal</span>
              <h3 className="text-lg font-bold text-white tracking-tight">Webhook Sandbox</h3>
            </div>
            <p className="text-xs text-white/40 mb-6">
              Simulate an incoming HDFC bank processor event to credit local customer wallets.
            </p>

            <form onSubmit={handleTriggerWebhook} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                  Customer User ID
                </label>
                <input
                  type="number"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="input-recessed block w-full py-2.5 px-3 rounded-xl text-xs"
                  placeholder="e.g. 1"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">
                  Deposit Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-recessed block w-full py-2.5 px-3 rounded-xl text-xs"
                  placeholder="e.g. 100"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-wider">
                    Transaction Token
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomToken}
                    className="text-[10px] text-secondaryCyan hover:underline font-bold"
                  >
                    Generate Token
                  </button>
                </div>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="input-recessed block w-full py-2.5 px-3 rounded-xl text-xs font-mono"
                  placeholder="Click Generate or enter value"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={sandboxLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] cursor-pointer"
              >
                {sandboxLoading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Trigger Local Webhook"
                )}
              </button>
            </form>
          </div>

          {/* Sandbox Terminal Result Output */}
          <div className="mt-6 pt-6 border-t border-white/5 flex-1 flex flex-col justify-end">
            <span className="block text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2">
              Console Output
            </span>
            <div className={`p-4 rounded-xl font-mono text-[10px] leading-relaxed overflow-y-auto max-h-40 border
              ${sandboxResult === null ? "bg-[#040f1c] text-white/30 border-white/5" :
                sandboxResult.success ? "bg-[#06201b] text-successGreen border-successGreen/20" :
                "bg-[#240c12] text-errorRose border-errorRose/20"}`}
            >
              {sandboxResult === null ? (
                <span>&gt;_ Standing by. Provide parameters and submit to execute webhook payload.</span>
              ) : (
                <div className="space-y-1">
                  <div className="font-bold text-xs">{sandboxResult.message}</div>
                  <div className="opacity-80">{sandboxResult.detail}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

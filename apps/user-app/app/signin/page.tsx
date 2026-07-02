"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        phone,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials. Try Alice (1111111111 / alice)");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (testPhone: string, testPass: string) => {
    setError("");
    setLoading(true);
    setPhone(testPhone);
    setPassword(testPass);
    try {
      const res = await signIn("credentials", {
        phone: testPhone,
        password: testPass,
        redirect: false,
      });

      if (res?.error) {
        setError("Sign-in failed");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#051424] px-4 py-12 sm:px-6 lg:px-8">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primaryBlue/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-secondaryCyan/10 blur-[120px] pointer-events-none"></div>

      <div className="relative w-full max-w-md">
        {/* Branding header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-primaryBlue to-secondaryCyan primary-glow">
            <span className="material-symbols-outlined text-darkIndigo font-bold text-2xl">account_balance_wallet</span>
          </div>
          <h2 className="mt-4 text-center font-heading text-3xl font-extrabold tracking-tight text-[#d4e4fa]">
            Elite Wallet
          </h2>
          <p className="mt-1 text-center text-sm text-[#adc7ff]/60">
            Sign in to your premium financial workspace
          </p>
        </div>

        {/* Card Container */}
        <div className="glass-panel p-8 rounded-2xl border border-primaryBlue/10 shadow-2xl relative overflow-hidden">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-errorRose/10 border border-errorRose/20 text-errorRose text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-[#d4e4fa]/70 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#adc7ff]/40">
                  <span className="material-symbols-outlined text-lg">phone_android</span>
                </span>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-recessed block w-full pl-10 pr-3 py-3 rounded-lg text-sm"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-[#d4e4fa]/70 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#adc7ff]/40">
                  <span className="material-symbols-outlined text-lg">lock</span>
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-recessed block w-full pl-10 pr-3 py-3 rounded-lg text-sm"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg text-sm font-bold text-darkIndigo bg-gradient-to-r from-primaryBlue to-secondaryCyan hover:opacity-90 active:scale-[0.98] transition-all primary-glow-hover cursor-pointer"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-darkIndigo border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Quick Login Shortcuts */}
          <div className="mt-8 pt-6 border-t border-[#adc7ff]/10">
            <span className="block text-center text-xs font-semibold text-[#d4e4fa]/40 uppercase tracking-wider mb-4">
              Demo Access accounts
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickLogin("1111111111", "alice")}
                className="flex flex-col items-center p-3 rounded-lg bg-[#122131]/60 border border-primaryBlue/10 hover:border-primaryBlue/30 hover:bg-[#122131] transition-all cursor-pointer group"
              >
                <div className="h-8 w-8 rounded-full bg-primaryBlue/10 flex items-center justify-center text-primaryBlue text-sm font-bold group-hover:bg-primaryBlue/20 transition-all">
                  A
                </div>
                <span className="mt-2 text-xs font-bold text-[#d4e4fa]">Alice (User)</span>
                <span className="text-[10px] text-[#adc7ff]/40">Quick sign in</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("2222222222", "bob")}
                className="flex flex-col items-center p-3 rounded-lg bg-[#122131]/60 border border-primaryBlue/10 hover:border-primaryBlue/30 hover:bg-[#122131] transition-all cursor-pointer group"
              >
                <div className="h-8 w-8 rounded-full bg-secondaryCyan/10 flex items-center justify-center text-secondaryCyan text-sm font-bold group-hover:bg-secondaryCyan/20 transition-all">
                  B
                </div>
                <span className="mt-2 text-xs font-bold text-[#d4e4fa]">Bob (User)</span>
                <span className="text-[10px] text-[#adc7ff]/40">Quick sign in</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

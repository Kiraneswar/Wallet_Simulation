"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function MerchantSignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<"credentials" | "google" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);
    setAuthMethod("credentials");
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Sign-in failed. Check details or use quick demo bypass.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
      setAuthMethod(null);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    setAuthMethod("google");
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      console.error(err);
      setError("Google authentication failed");
      setLoading(false);
      setAuthMethod(null);
    }
  };

  const handleQuickLogin = async (testEmail: string) => {
    setError("");
    setLoading(true);
    setAuthMethod("credentials");
    setEmail(testEmail);
    setPassword("demo-bypass-pass");
    try {
      const res = await signIn("credentials", {
        email: testEmail,
        password: "demo-bypass-pass",
        redirect: false,
      });

      if (res?.error) {
        setError("Bypass sign-in failed");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("Bypass sign-in failed");
    } finally {
      setLoading(false);
      setAuthMethod(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#051424] px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-secondaryCyan/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#9f1239]/10 blur-[150px] pointer-events-none"></div>

      <div className="relative w-full max-w-md z-10">
        {/* Branding header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#06b6d4] to-[#3b82f6] shadow-[0_0_20px_rgba(6,182,212,0.35)]">
            <span className="material-symbols-outlined text-[#051424] font-bold text-3xl">storefront</span>
          </div>
          <h2 className="mt-5 text-center font-heading text-3xl font-extrabold tracking-tight text-[#d4e4fa]">
            Elite Merchant
          </h2>
          <p className="mt-1.5 text-center text-sm text-[#adc7ff]/60">
            Control your institutional payment infrastructure
          </p>
        </div>

        {/* Card Container */}
        <div className="glass-panel p-8 rounded-3xl border border-secondaryCyan/10 shadow-2xl relative overflow-hidden bg-opacity-40 backdrop-blur-md">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-errorRose/10 border border-errorRose/20 text-[#fda4af] text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Social login option */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-primaryBlue/20 rounded-xl text-sm font-bold text-[#d4e4fa] bg-[#0c1e30]/80 hover:bg-[#122c47]/80 active:scale-[0.98] transition-all cursor-pointer mb-6 hover:border-secondaryCyan/30"
          >
            {loading && authMethod === "google" ? (
              <div className="h-5 w-5 border-2 border-[#d4e4fa] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.984 0-.743-.08-1.3-.176-1.865H12.24z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-[#adc7ff]/10 w-full"></div>
            <span className="absolute bg-[#091a2d] px-3 text-xs font-semibold text-[#d4e4fa]/40 uppercase tracking-wider">
              Or credentials
            </span>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[#d4e4fa]/70 uppercase tracking-wider mb-2">
                Merchant Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#adc7ff]/40">
                  <span className="material-symbols-outlined text-lg">mail</span>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-recessed block w-full pl-10 pr-3 py-3 rounded-xl text-sm"
                  placeholder="name@business.com"
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
                  className="input-recessed block w-full pl-10 pr-3 py-3 rounded-xl text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-darkIndigo bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_22px_rgba(6,182,212,0.4)] cursor-pointer text-white font-extrabold"
            >
              {loading && authMethod === "credentials" ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Access Dashboard"
              )}
            </button>
          </form>

          {/* Quick Developer Bypass Shortcuts */}
          <div className="mt-8 pt-6 border-t border-[#adc7ff]/10">
            <span className="block text-center text-xs font-semibold text-[#d4e4fa]/40 uppercase tracking-wider mb-4">
              Developer Bypass (Local Test)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickLogin("acme-corp@example.com")}
                className="flex flex-col items-center p-3 rounded-xl bg-[#0c1e30]/60 border border-primaryBlue/10 hover:border-secondaryCyan/30 hover:bg-[#0c1e30] transition-all cursor-pointer group"
              >
                <div className="h-8 w-8 rounded-full bg-primaryBlue/10 flex items-center justify-center text-secondaryCyan text-xs font-bold group-hover:bg-secondaryCyan/20 transition-all">
                  AC
                </div>
                <span className="mt-2 text-xs font-bold text-[#d4e4fa]">Acme Corp</span>
                <span className="text-[10px] text-[#adc7ff]/40">Bypass Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("globex@example.com")}
                className="flex flex-col items-center p-3 rounded-xl bg-[#0c1e30]/60 border border-primaryBlue/10 hover:border-secondaryCyan/30 hover:bg-[#0c1e30] transition-all cursor-pointer group"
              >
                <div className="h-8 w-8 rounded-full bg-secondaryCyan/10 flex items-center justify-center text-secondaryCyan text-xs font-bold group-hover:bg-secondaryCyan/20 transition-all">
                  GX
                </div>
                <span className="mt-2 text-xs font-bold text-[#d4e4fa]">Globex Inc</span>
                <span className="text-[10px] text-[#adc7ff]/40">Bypass Sign In</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

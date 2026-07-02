import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const merchantName = session.user.name || "Enterprise Merchant";
  const merchantEmail = session.user.email || "merchant@example.com";

  // Mock analytics data for the premium interface
  const totalVolume = "$148,920.00";
  const totalTransactions = "1,842";
  const activeCustomers = "1,208";
  const successRate = "99.8%";

  const recentTransactions = [
    { id: "TXN-9021", user: "Alice Smith", email: "alice@gmail.com", amount: "+$120.00", status: "Success", time: "2 mins ago" },
    { id: "TXN-9020", user: "Bob Jenkins", email: "bob@yahoo.com", amount: "+$45.50", status: "Success", time: "15 mins ago" },
    { id: "TXN-9019", user: "Charlie Brown", email: "charlie@gmail.com", amount: "+$299.99", status: "Processing", time: "1 hour ago" },
    { id: "TXN-9018", user: "Diana Prince", email: "diana@amazon.com", amount: "+$1,050.00", status: "Success", time: "3 hours ago" },
    { id: "TXN-9017", user: "Evan Wright", email: "evan@outlook.com", amount: "+$15.00", status: "Failed", time: "5 hours ago" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-secondaryCyan/10 bg-gradient-to-r from-[#0a223a] to-[#051424] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-secondaryCyan/5 blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondaryCyan/10 px-3 py-1 text-xs font-semibold text-secondaryCyan mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-secondaryCyan animate-pulse"></span>
            LIVE WORKSPACE
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome back, {merchantName}!
          </h1>
          <p className="mt-2 text-[#adc7ff]/60 max-w-2xl">
            Your merchant account <span className="text-[#d4e4fa] font-semibold">{merchantEmail}</span> is active. Monitor your real-time processing volume, api credentials, and ledger flows below.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Gross Volume</span>
            <span className="material-symbols-outlined text-secondaryCyan bg-secondaryCyan/15 p-2 rounded-xl text-lg">trending_up</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">{totalVolume}</h3>
            <p className="text-[10px] text-secondaryCyan font-semibold flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-xs">arrow_upward</span> +18.4% this month
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Checkouts</span>
            <span className="material-symbols-outlined text-[#3b82f6] bg-[#3b82f6]/15 p-2 rounded-xl text-lg">shopping_cart</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">{totalTransactions}</h3>
            <p className="text-[10px] text-[#3b82f6] font-semibold flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-xs">arrow_upward</span> +12.3% this month
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Customers</span>
            <span className="material-symbols-outlined text-[#a855f7] bg-[#a855f7]/15 p-2 rounded-xl text-lg">group</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">{activeCustomers}</h3>
            <p className="text-[10px] text-[#a855f7] font-semibold flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-xs">arrow_upward</span> +8.9% this month
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Success Rate</span>
            <span className="material-symbols-outlined text-successGreen bg-successGreen/15 p-2 rounded-xl text-lg">bolt</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">{successRate}</h3>
            <p className="text-[10px] text-[#4edea3] font-semibold flex items-center gap-1 mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4edea3] inline-block"></span> API is healthy
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts & Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart Card */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Sales Analytics</h3>
              <p className="text-xs text-white/40">Hourly processing volume trend</p>
            </div>
            <div className="flex bg-[#0c1e30] border border-white/10 rounded-xl p-0.5 text-xs text-white/60">
              <button className="bg-secondaryCyan/10 text-secondaryCyan font-semibold px-3 py-1 rounded-lg">1D</button>
              <button className="px-3 py-1 rounded-lg hover:text-white transition-all">1W</button>
              <button className="px-3 py-1 rounded-lg hover:text-white transition-all">1M</button>
            </div>
          </div>

          {/* Custom SVG Line Chart */}
          <div className="h-60 w-full relative flex items-end">
            <svg viewBox="0 0 100 40" className="w-full h-full text-secondaryCyan" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(255,255,255,0.03)" strokeWidth="0.1" />
              <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="0.1" />
              <line x1="0" y1="30" x2="100" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="0.1" />
              {/* Chart Line Path */}
              <path
                d="M 0 35 Q 15 25 25 32 T 50 15 T 75 10 T 100 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                className="drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]"
              />
              {/* Fill Path */}
              <path
                d="M 0 35 Q 15 25 25 32 T 50 15 T 75 10 T 100 8 L 100 40 L 0 40 Z"
                fill="url(#chartGradient)"
              />
            </svg>
            {/* Absolute indicator */}
            <div className="absolute top-10 right-1/4 bg-[#0a1e33] border border-secondaryCyan/30 rounded-lg p-2 shadow-lg text-[10px] pointer-events-none">
              <span className="block text-white/50">Peak volume:</span>
              <span className="block font-bold text-white">$14,250.00</span>
              <span className="block text-[8px] text-secondaryCyan font-semibold">12:00 PM</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-white/30 font-semibold uppercase tracking-wider mt-4 px-2">
            <span>08:00 AM</span>
            <span>12:00 PM</span>
            <span>04:00 PM</span>
            <span>08:00 PM</span>
            <span>12:00 AM</span>
          </div>
        </div>

        {/* Recent Checkout Activity Table Card */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Recent Checkouts</h3>
            <p className="text-xs text-white/40 mb-6">Latest transaction logs</p>
          </div>

          <div className="space-y-4 flex-1">
            {recentTransactions.map((txn) => (
              <div key={txn.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs
                    ${txn.status === "Success" ? "bg-successGreen/15 text-successGreen" :
                      txn.status === "Processing" ? "bg-[#3b82f6]/15 text-[#3b82f6]" :
                      "bg-errorRose/15 text-errorRose"}`}
                  >
                    {txn.user[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{txn.user}</h4>
                    <p className="text-[10px] text-white/40">{txn.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold ${txn.status === "Success" ? "text-successGreen" : "text-white"}`}>
                    {txn.amount}
                  </span>
                  <span className={`block text-[9px] font-semibold
                    ${txn.status === "Success" ? "text-successGreen" :
                      txn.status === "Processing" ? "text-[#3b82f6]" :
                      "text-errorRose"}`}
                  >
                    {txn.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <a href="/payments" className="w-full inline-flex justify-center items-center gap-1 py-2 border border-white/10 rounded-xl text-xs font-semibold text-[#adc7ff] hover:bg-white/5 transition-all">
              Go to Payments Ledger <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

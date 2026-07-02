import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { redirect } from "next/navigation";
import db from "@repo/db/client";

export default async function PaymentsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  // Query actual users registered in the system from the database to represent checkout accounts
  const systemUsers = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      number: true,
    },
    take: 10,
  });

  // Mock invoice data for checkout transactions
  const paymentsLedger = [
    { id: "INV-2026-001", customer: "Alice Smith", email: "alice@gmail.com", amount: "$120.00", fee: "$1.20", net: "$118.80", status: "Success", date: "May 21, 2026 12:54 PM", method: "Wallet Checkout" },
    { id: "INV-2026-002", customer: "Bob Jenkins", email: "bob@yahoo.com", amount: "$45.50", fee: "$0.46", net: "$45.04", status: "Success", date: "May 21, 2026 12:41 PM", method: "Wallet Checkout" },
    { id: "INV-2026-003", customer: "Charlie Brown", email: "charlie@gmail.com", amount: "$299.99", fee: "$3.00", net: "$296.99", status: "Processing", date: "May 21, 2026 11:30 AM", method: "Card Processing" },
    { id: "INV-2026-004", customer: "Diana Prince", email: "diana@amazon.com", amount: "$1,050.00", fee: "$10.50", net: "$1,039.50", status: "Success", date: "May 20, 2026 09:15 PM", method: "Bank Instant" },
    { id: "INV-2026-005", customer: "Evan Wright", email: "evan@outlook.com", amount: "$15.00", fee: "$0.15", net: "$14.85", status: "Failed", date: "May 20, 2026 07:42 PM", method: "Wallet Checkout" },
    { id: "INV-2026-006", customer: "Fiona Gallagher", email: "fiona@gmail.com", amount: "$89.90", fee: "$0.90", net: "$89.00", status: "Success", date: "May 19, 2026 04:10 PM", method: "Wallet Checkout" },
    { id: "INV-2026-007", customer: "George Costanza", email: "george@seinfeld.com", amount: "$12.00", fee: "$0.12", net: "$11.88", status: "Success", date: "May 19, 2026 01:25 PM", method: "Card Processing" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Payments Ledger</h1>
        <p className="mt-1 text-sm text-[#adc7ff]/60">
          Search and audit all transaction invoices, settlement values, and processing mechanisms.
        </p>
      </div>

      {/* Grid of Main Ledger and DB Users */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Ledger Table */}
        <div className="xl:col-span-2 glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <h3 className="text-lg font-bold text-white tracking-tight">Invoice Records</h3>
            {/* Search Input mock */}
            <div className="flex items-center gap-2 bg-[#0c1e30] border border-white/10 rounded-xl px-3 py-1.5 w-64">
              <span className="material-symbols-outlined text-white/40 text-sm">search</span>
              <input 
                type="text" 
                placeholder="Filter invoice, customer..." 
                className="bg-transparent border-none text-white text-xs placeholder-white/30 focus:outline-none w-full"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs font-semibold text-white/40 uppercase tracking-wider">
                  <th className="py-3 px-2">Invoice ID</th>
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Settlement</th>
                  <th className="py-3 px-2">Method</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paymentsLedger.map((row) => (
                  <tr key={row.id} className="text-xs hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-2 font-mono font-bold text-secondaryCyan">{row.id}</td>
                    <td className="py-4 px-2">
                      <div className="font-bold text-white">{row.customer}</div>
                      <div className="text-white/40 text-[10px]">{row.email}</div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="font-bold text-white">{row.amount}</div>
                      <div className="text-[10px] text-white/40">Fee: {row.fee} | Net: {row.net}</div>
                    </td>
                    <td className="py-4 px-2 text-white/70">{row.method}</td>
                    <td className="py-4 px-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold
                        ${row.status === "Success" ? "bg-successGreen/10 text-successGreen" :
                          row.status === "Processing" ? "bg-[#3b82f6]/10 text-[#3b82f6]" :
                          "bg-errorRose/10 text-errorRose"}`}
                      >
                        <span className={`h-1 w-1 rounded-full 
                          ${row.status === "Success" ? "bg-successGreen" :
                            row.status === "Processing" ? "bg-[#3b82f6]" :
                            "bg-errorRose"}`}
                        ></span>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-white/40">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Database Customers Panel */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-secondaryCyan text-lg">database</span>
              <h3 className="text-lg font-bold text-white tracking-tight">DB Wallet Accounts</h3>
            </div>
            <p className="text-xs text-white/40 mb-6">
              Active system users queried via Prisma. They can execute checkout workflows.
            </p>

            <div className="space-y-4">
              {systemUsers.length === 0 ? (
                <div className="text-center py-8 text-xs text-white/30 border border-dashed border-white/10 rounded-xl">
                  No registered users found. Run database seeds.
                </div>
              ) : (
                systemUsers.map((u) => (
                  <div key={u.id} className="flex justify-between items-center p-3 rounded-xl bg-[#0c1e30]/60 border border-white/5 hover:border-secondaryCyan/20 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-secondaryCyan/10 flex items-center justify-center text-secondaryCyan text-xs font-bold">
                        {u.name ? u.name[0]?.toUpperCase() : "U"}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{u.name || "Anonymous User"}</h4>
                        <p className="text-[10px] text-white/40">ID: {u.id} | Phone: {u.number}</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-secondaryCyan/10 text-secondaryCyan px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Wallet
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5">
            <p className="text-[10px] text-white/30 text-center leading-relaxed">
              Verify these accounts on the user portal to simulate instant P2P/Merchant checkout integrations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

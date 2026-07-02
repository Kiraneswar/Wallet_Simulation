import prisma from "@repo/db/client";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";

async function getBalance(userId: number) {
    const balance = await prisma.balance.findFirst({
        where: {
            userId: userId
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getOnRampTransactions(userId: number) {
    const txns = await prisma.onRampTransaction.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            startTime: 'desc'
        }
    });
    return txns.map(t => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }))
}

export default async function TransferPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/api/auth/signin");
    }

    const userId = Number(session.user.id);
    const balance = await getBalance(userId);
    const transactions = await getOnRampTransactions(userId);

    return (
        <div className="space-y-8 w-full max-w-6xl mx-auto">
            {/* Header */}
            <div>
                <h2 className="font-heading font-extrabold text-3xl text-white tracking-tight leading-none">
                    Transfer Funds
                </h2>
                <p className="text-white/50 text-sm mt-2">
                    Deposit money using Net Banking or save cards into your wallet instantly.
                </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <AddMoney />
                </div>
                <div className="space-y-6">
                    <BalanceCard amount={balance.amount} locked={balance.locked} />
                    <OnRampTransactions transactions={transactions} />
                </div>
            </div>
        </div>
    );
}
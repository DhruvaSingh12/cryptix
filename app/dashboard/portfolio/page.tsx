"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, Plus } from "lucide-react";
import coinGeckoAPI from "@/lib/api/coingecko";
import { PageHeader } from "@/components/PageHeader";
import { PortfolioSummaryCards } from "./components/PortfolioSummaryCards";
import { TransactionTable, Transaction } from "./components/TransactionTable";
import { AddTransactionDialog } from "./components/AddTransactionDialog";

interface Portfolio {
    id: string;
    name: string;
    transactions: Transaction[];
}

export default function PortfolioPage() {
    const { data: session } = useSession();
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [activePortfolio, setActivePortfolio] = useState<Portfolio | null>(null);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
    const [coinPrices, setCoinPrices] = useState<Record<string, number>>({});
    const [newPortfolioName, setNewPortfolioName] = useState("");

    useEffect(() => {
        loadPortfolios();
    }, [session?.user?.id]);

    useEffect(() => {
        if (activePortfolio) {
            fetchCoinPrices();
        }
    }, [activePortfolio]);

    const loadPortfolios = () => {
        const saved = localStorage.getItem(`portfolios-${session?.user?.id}`);
        if (saved) {
            const parsed = JSON.parse(saved);
            setPortfolios(parsed);
            if (parsed.length > 0) {
                setActivePortfolio(parsed[0]);
            }
        }
        setLoading(false);
    };

    const savePortfolios = (newPortfolios: Portfolio[]) => {
        localStorage.setItem(
            `portfolios-${session?.user?.id}`,
            JSON.stringify(newPortfolios)
        );
        setPortfolios(newPortfolios);
    };

    const fetchCoinPrices = async () => {
        if (!activePortfolio) return;
        const uniqueCoins = [
            ...new Set(activePortfolio.transactions.map((t) => t.coinId)),
        ];
        if (uniqueCoins.length === 0) return;

        try {
            const prices = await coinGeckoAPI.getSimplePrice(uniqueCoins, ["usd"]);
            const priceMap: Record<string, number> = {};
            Object.entries(prices).forEach(([id, data]: [string, any]) => {
                priceMap[id] = data.usd;
            });
            setCoinPrices(priceMap);
        } catch (error) {
            console.error("Error fetching prices:", error);
        }
    };

    const createPortfolio = () => {
        if (!newPortfolioName.trim()) return;
        const newPortfolio: Portfolio = {
            id: Date.now().toString(),
            name: newPortfolioName,
            transactions: [],
        };
        const updated = [...portfolios, newPortfolio];
        savePortfolios(updated);
        setActivePortfolio(newPortfolio);
        setNewPortfolioName("");
        setDialogOpen(false);
    };

    const addTransaction = (transaction: Omit<Transaction, "id">) => {
        if (!activePortfolio) return;

        const newTransaction: Transaction = {
            id: Date.now().toString(),
            ...transaction,
        };

        const updatedPortfolio = {
            ...activePortfolio,
            transactions: [...activePortfolio.transactions, newTransaction],
        };

        const updatedPortfolios = portfolios.map((p) =>
            p.id === activePortfolio.id ? updatedPortfolio : p
        );

        savePortfolios(updatedPortfolios);
        setActivePortfolio(updatedPortfolio);
        setTransactionDialogOpen(false);
    };

    const deleteTransaction = (transactionId: string) => {
        if (!activePortfolio) return;

        const updatedPortfolio = {
            ...activePortfolio,
            transactions: activePortfolio.transactions.filter(
                (t) => t.id !== transactionId
            ),
        };

        const updatedPortfolios = portfolios.map((p) =>
            p.id === activePortfolio.id ? updatedPortfolio : p
        );

        savePortfolios(updatedPortfolios);
        setActivePortfolio(updatedPortfolio);
    };

    const calculateSummary = () => {
        if (!activePortfolio) return { totalValue: 0, totalCost: 0, profitLoss: 0 };

        const holdings: Record<string, { amount: number; cost: number }> = {};

        activePortfolio.transactions.forEach((t) => {
            if (!holdings[t.coinId]) {
                holdings[t.coinId] = { amount: 0, cost: 0 };
            }
            if (t.type === "BUY") {
                holdings[t.coinId].amount += t.amount;
                holdings[t.coinId].cost += t.amount * t.pricePerCoin;
            } else {
                holdings[t.coinId].amount -= t.amount;
                holdings[t.coinId].cost -= t.amount * t.pricePerCoin;
            }
        });

        let totalValue = 0;
        let totalCost = 0;

        Object.entries(holdings).forEach(([coinId, data]) => {
            if (data.amount > 0) {
                totalCost += data.cost;
                totalValue += data.amount * (coinPrices[coinId] || 0);
            }
        });

        return {
            totalValue,
            totalCost,
            profitLoss: totalValue - totalCost,
        };
    };

    const summary = calculateSummary();

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-12 w-64" />
                <div className="grid gap-4 md:grid-cols-3">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                icon={Wallet}
                iconColor="text-emerald-500"
                title="Portfolio"
                description="Track your cryptocurrency investments"
            >
                {portfolios.length > 0 && (
                    <Select
                        value={activePortfolio?.id}
                        onValueChange={(id) =>
                            setActivePortfolio(portfolios.find((p) => p.id === id) || null)
                        }
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select portfolio" />
                        </SelectTrigger>
                        <SelectContent>
                            {portfolios.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                    {p.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            New Portfolio
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Portfolio</DialogTitle>
                            <DialogDescription>
                                Create a new portfolio to track your investments
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Portfolio Name</Label>
                                <Input
                                    placeholder="e.g., Main Portfolio"
                                    value={newPortfolioName}
                                    onChange={(e) => setNewPortfolioName(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={createPortfolio}>Create</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </PageHeader>

            {!activePortfolio ? (
                <Card className="py-12">
                    <CardContent className="text-center">
                        <Wallet className="h-12 w-12 mx-auto text-muted-foreground/20 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No portfolios yet</h3>
                        <p className="text-muted-foreground mb-4">
                            Create your first portfolio to start tracking investments
                        </p>
                        <Button onClick={() => setDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Portfolio
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <PortfolioSummaryCards
                        totalValue={summary.totalValue}
                        totalCost={summary.totalCost}
                        profitLoss={summary.profitLoss}
                    />

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Transactions</CardTitle>
                                <CardDescription>
                                    {activePortfolio.transactions.length} transactions in {activePortfolio.name}
                                </CardDescription>
                            </div>
                            <AddTransactionDialog
                                open={transactionDialogOpen}
                                onOpenChange={setTransactionDialogOpen}
                                onSubmit={addTransaction}
                            />
                        </CardHeader>
                        <CardContent>
                            <TransactionTable
                                transactions={activePortfolio.transactions}
                                onDelete={deleteTransaction}
                            />
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import coinGeckoAPI from "@/lib/api/coingecko";
import Image from "next/image";

interface CoinResult {
    id: string;
    symbol: string;
    name: string;
    thumb: string;
    large?: string;
}

interface AddTransactionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (transaction: {
        coinId: string;
        coinSymbol: string;
        coinName: string;
        coinImage: string;
        type: "BUY" | "SELL";
        amount: number;
        pricePerCoin: number;
        date: string;
    }) => void;
}

export function AddTransactionDialog({ open, onOpenChange, onSubmit }: AddTransactionDialogProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<CoinResult[]>([]);
    const [selectedCoin, setSelectedCoin] = useState<CoinResult | null>(null);
    const [transactionType, setTransactionType] = useState<"BUY" | "SELL">("BUY");
    const [amount, setAmount] = useState("");
    const [pricePerCoin, setPricePerCoin] = useState("");
    const [transactionDate, setTransactionDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        try {
            const results = await coinGeckoAPI.search(searchQuery);
            setSearchResults(results.coins?.slice(0, 5) || []);
        } catch (error) {
            console.error("Error searching:", error);
        }
    };

    const selectCoin = async (coin: CoinResult) => {
        setSelectedCoin(coin);
        setSearchResults([]);
        setSearchQuery(coin.name);

        try {
            const prices = await coinGeckoAPI.getSimplePrice([coin.id], ["usd"]);
            if (prices[coin.id]) {
                setPricePerCoin(prices[coin.id].usd.toString());
            }
        } catch (error) {
            console.error("Error fetching price:", error);
        }
    };

    const handleSubmit = () => {
        if (!selectedCoin || !amount || !pricePerCoin) return;

        onSubmit({
            coinId: selectedCoin.id,
            coinSymbol: selectedCoin.symbol,
            coinName: selectedCoin.name,
            coinImage: selectedCoin.large || selectedCoin.thumb,
            type: transactionType,
            amount: parseFloat(amount),
            pricePerCoin: parseFloat(pricePerCoin),
            date: transactionDate,
        });

        // Reset form
        setSelectedCoin(null);
        setSearchQuery("");
        setAmount("");
        setPricePerCoin("");
        setTransactionType("BUY");
        setTransactionDate(new Date().toISOString().split("T")[0]);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Transaction
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Search coin..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <Button onClick={handleSearch} size="icon">
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                    {searchResults.length > 0 && (
                        <div className="space-y-1">
                            {searchResults.map((coin) => (
                                <button
                                    key={coin.id}
                                    onClick={() => selectCoin(coin)}
                                    className="w-full flex items-center gap-2 p-2 rounded hover:bg-accent"
                                >
                                    <Image
                                        src={coin.thumb}
                                        alt={coin.name}
                                        width={20}
                                        height={20}
                                        className="rounded-full"
                                    />
                                    {coin.name} ({coin.symbol.toUpperCase()})
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Type</Label>
                            <Select
                                value={transactionType}
                                onValueChange={(v) => setTransactionType(v as "BUY" | "SELL")}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BUY">Buy</SelectItem>
                                    <SelectItem value="SELL">Sell</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Date</Label>
                            <Input
                                type="date"
                                value={transactionDate}
                                onChange={(e) => setTransactionDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Amount</Label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Price per Coin ($)</Label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={pricePerCoin}
                                onChange={(e) => setPricePerCoin(e.target.value)}
                            />
                        </div>
                    </div>
                    {amount && pricePerCoin && (
                        <div className="text-sm text-muted-foreground">
                            Total: ${(parseFloat(amount) * parseFloat(pricePerCoin)).toLocaleString()}
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={!selectedCoin || !amount || !pricePerCoin}>
                        Add Transaction
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

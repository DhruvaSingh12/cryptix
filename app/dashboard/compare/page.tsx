"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import coinGeckoAPI from "@/lib/api/coingecko";
import { CoinDetail } from "@/lib/api/types";
import { PageHeader } from "@/components/PageHeader";
import { CoinSelector } from "./components/CoinSelector";
import { ComparisonTable } from "./components/ComparisonTable";

export default function ComparePage() {
    const [coins, setCoins] = useState<CoinDetail[]>([]);
    const [loading, setLoading] = useState(false);

    const addCoin = async (coin: { id: string }) => {
        if (coins.some((c) => c.id === coin.id) || coins.length >= 4) return;

        setLoading(true);
        try {
            const data = await coinGeckoAPI.getCoinById(coin.id, {
                localization: false,
                tickers: false,
                marketData: true,
                communityData: false,
                developerData: false,
                sparkline: false,
            });
            setCoins([...coins, data]);
        } catch (error) {
            console.error("Error fetching coin:", error);
        } finally {
            setLoading(false);
        }
    };

    const removeCoin = (coinId: string) => {
        setCoins(coins.filter((c) => c.id !== coinId));
    };

    return (
        <div className="space-y-6 p-4 lg:p-6">
            <PageHeader
                icon={BarChart3}
                iconColor="text-cyan-500"
                title="Compare Coins"
                description="Side-by-side cryptocurrency comparison"
            />

            <CoinSelector
                coins={coins}
                onAddCoin={addCoin}
                onRemoveCoin={removeCoin}
                loading={loading}
            />

            {coins.length > 0 ? (
                <ComparisonTable coins={coins} />
            ) : (
                <Card className="py-12">
                    <CardContent className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/20 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No coins selected</h3>
                        <p className="text-muted-foreground">
                            Search and add coins above to start comparing
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

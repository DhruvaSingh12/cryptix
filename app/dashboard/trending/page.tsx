"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame } from "lucide-react";
import coinGeckoAPI from "@/lib/api/coingecko";
import { PageHeader } from "@/components/PageHeader";
import { TrendingCoinCard } from "./components/TrendingCoinCard";

interface TrendingCoin {
    item: {
        id: string;
        coin_id: number;
        name: string;
        symbol: string;
        market_cap_rank: number;
        thumb: string;
        large: string;
        slug: string;
        price_btc: number;
        score: number;
    };
}

export default function TrendingPage() {
    const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrending();
    }, []);

    const fetchTrending = async () => {
        try {
            const data = await coinGeckoAPI.getTrending();
            setTrendingCoins(data.coins || []);
        } catch (error) {
            console.error("Error fetching trending:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 p-4 lg:p-6">
            <PageHeader
                icon={Flame}
                iconColor="text-orange-500"
                title="Trending Coins"
                description="Most searched coins in the last 24 hours"
            />

            {loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(7)].map((_, i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {trendingCoins.map((coin, index) => (
                        <TrendingCoinCard key={coin.item.id} coin={coin} index={index} />
                    ))}
                </div>
            )}
        </div>
    );
}

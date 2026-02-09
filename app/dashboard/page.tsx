"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Zap, ChevronDown } from "lucide-react";
import coinGeckoAPI from "@/lib/api/coingecko";
import { Coin } from "@/lib/api/types";
import { GlobalStatsBar } from "@/components/dashboard/GlobalStatsBar";
import { HighlightsGrid } from "@/components/dashboard/HighlightsGrid";
import { CoinTable } from "@/components/dashboard/CoinTable";
import { formatCurrency } from "@/lib/utils/format";

export default function DashboardPage() {
    const [globalData, setGlobalData] = useState<any>(null);
    const [trending, setTrending] = useState<any[]>([]);
    const [gainers, setGainers] = useState<Coin[]>([]);
    const [coins, setCoins] = useState<Coin[]>([]);
    const [loading, setLoading] = useState(true);
    const [showHighlights, setShowHighlights] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [global, trendingData, topGainers, marketCoins] = await Promise.all([
                coinGeckoAPI.getGlobalData(),
                coinGeckoAPI.getTrending(),
                coinGeckoAPI.getCoinsMarkets("usd", {
                    order: "price_change_percentage_24h_desc",
                    perPage: 10,
                    page: 1,
                }),
                coinGeckoAPI.getCoinsMarkets("usd", {
                    order: "market_cap_desc",
                    perPage: 100,
                    page: 1,
                    sparkline: true,
                    priceChangePercentage: "1h,24h,7d",
                }),
            ]);
            setGlobalData(global.data);
            setTrending(trendingData.coins || []);
            setGainers(topGainers || []);
            setCoins(marketCoins || []);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 min-h-screen p-4 lg:p-6">
                <Skeleton className="h-10 w-full rounded-none" />
                <div className="container mx-auto px-4 space-y-8 py-8 max-w-[1400px]">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {[...Array(2)].map((_, i) => (
                            <Skeleton key={i} className="h-48 rounded-xl" />
                        ))}
                    </div>
                    <Skeleton className="h-[600px] rounded-xl" />
                </div>
            </div>
        );
    }

    const marketChange = globalData?.market_cap_change_percentage_24h_usd || 0;
    const totalMarketCap = globalData?.total_market_cap?.usd || 0;

    const tabs = [
        { id: "all", label: "All Assets" },
        { id: "gainers", label: "Gainers" },
        { id: "losers", label: "Losers" },
        { id: "new", label: "New Listings" },
    ];

    return (
        <div className="min-h-screen bg-background">
            <GlobalStatsBar data={globalData} />

            <div className="container mx-auto py-6 px-4 md:px-6 space-y-6 max-w-[1400px]">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                            Market Overview
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Global crypto market cap is{" "}
                            <span className="font-semibold text-foreground">
                                {formatCurrency(totalMarketCap)}
                            </span>
                            , a{" "}
                            <span className={marketChange >= 0 ? "text-emerald-500 font-semibold" : "text-red-500 font-semibold"}>
                                {marketChange >= 0 ? "+" : ""}{marketChange.toFixed(2)}%
                            </span>{" "}
                            change over the last day.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Label htmlFor="highlights" className="text-xs font-medium cursor-pointer">
                                Show Highlights
                            </Label>
                            <Switch
                                id="highlights"
                                checked={showHighlights}
                                onCheckedChange={setShowHighlights}
                                className="scale-90"
                            />
                        </div>
                    </div>
                </div>

                {/* Highlights Grid */}
                {showHighlights && (
                    <HighlightsGrid trending={trending} gainers={gainers} />
                )}

                {/* Main Content Area */}
                <div className="space-y-4">
                    {/* Tab Filters */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab.id
                                        ? "bg-card text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        <Button variant="outline" size="sm" className="h-9 gap-2 text-xs font-medium hidden sm:flex">
                            <Zap className="h-3.5 w-3.5" />
                            Customize
                            <ChevronDown className="h-3 w-3 opacity-50" />
                        </Button>
                    </div>

                    {/* Coin Table */}
                    <CoinTable coins={coins} loading={loading} />
                </div>
            </div>
        </div>
    );
}


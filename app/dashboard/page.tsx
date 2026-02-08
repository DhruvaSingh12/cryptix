"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Zap, TrendingUp, BarChart3, Globe } from "lucide-react";
import coinGeckoAPI from "@/lib/api/coingecko";
import { Coin } from "@/lib/api/types";
import { GlobalStatsBar } from "@/components/dashboard/GlobalStatsBar";
import { HighlightsGrid } from "@/components/dashboard/HighlightsGrid";
import { CoinTable } from "@/components/dashboard/CoinTable";
import { Sparkline } from "@/components/dashboard/Sparkline";
import { formatCurrency, formatCompactNumber } from "@/lib/utils/format";

export default function DashboardPage() {
    const { data: session } = useSession();
    const [globalData, setGlobalData] = useState<any>(null);
    const [trending, setTrending] = useState<any[]>([]);
    const [gainers, setGainers] = useState<Coin[]>([]);
    const [coins, setCoins] = useState<Coin[]>([]);
    const [loading, setLoading] = useState(true);
    const [showHighlights, setShowHighlights] = useState(true);

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
            <div className="space-y-6 min-h-screen bg-gray-50/50 dark:bg-background">
                <Skeleton className="h-10 w-full rounded-none" />
                <div className="container mx-auto px-4 space-y-8 py-8 max-w-7xl">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-32 rounded-xl" />
                        ))}
                    </div>
                    <Skeleton className="h-[600px] rounded-xl" />
                </div>
            </div>
        );
    }

    const marketChange = globalData?.market_cap_change_percentage_24h_usd || 0;
    const totalMarketCap = globalData?.total_market_cap?.usd || 0;
    const totalVolume = globalData?.total_volume?.usd || 0;
    const btcDominance = globalData?.market_cap_percentage?.btc || 0;
    const activeCryptos = globalData?.active_cryptocurrencies || 0;

    return (
        <div className="min-h-screen">
            <GlobalStatsBar data={globalData} />

            <div className="container mx-auto py-4 px-4 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                            Market Overview
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Global crypto market cap is <span className="font-bold text-foreground">{formatCurrency(totalMarketCap)}</span>, a <span className={marketChange >= 0 ? "text-emerald-500 font-bold" : "text-red-500 font-bold"}>{marketChange >= 0 ? "+" : ""}{marketChange.toFixed(2)}%</span> change over the last day.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="highlights" className="text-xs font-bold cursor-pointer text-muted-foreground">Show Highlights</Label>
                        <Switch
                            id="highlights"
                            checked={showHighlights}
                            onCheckedChange={setShowHighlights}
                            className="scale-90"
                        />
                    </div>
                </div>

                {/* Key Metrics Grid */}
                {showHighlights && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-none shadow-sm bg-card hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex flex-col justify-between h-full">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Market Cap</p>
                                    <p className="text-2xl font-bold text-foreground">{formatCompactNumber(totalMarketCap)}</p>
                                </div>
                                <div className="mt-4 h-10 w-full opacity-50">
                                    {coins[0]?.sparkline_in_7d && (
                                        <Sparkline
                                            data={coins[0].sparkline_in_7d.price}
                                            isPositive={marketChange >= 0}
                                        />
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm bg-card hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex flex-col justify-between h-full">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">24h Volume</p>
                                    <p className="text-2xl font-bold text-foreground">{formatCompactNumber(totalVolume)}</p>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <BarChart3 className="h-8 w-8 text-primary/20" />
                                    <span className="text-xs text-muted-foreground font-medium">Vol/Cap: {((totalVolume / totalMarketCap) * 100).toFixed(2)}%</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm bg-card hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex flex-col justify-between h-full">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Dominance</p>
                                    <p className="text-2xl font-bold text-foreground">BTC {btcDominance.toFixed(1)}%</p>
                                </div>
                                <div className="mt-4 w-full bg-secondary/50 h-2 rounded-full overflow-hidden">
                                    <div className="bg-orange-500 h-full" style={{ width: `${btcDominance}%` }} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm bg-card hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex flex-col justify-between h-full">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Coins</p>
                                    <p className="text-2xl font-bold text-foreground">{activeCryptos.toLocaleString()}</p>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <Globe className="h-8 w-8 text-blue-500/20" />
                                    <span className="text-xs text-muted-foreground font-medium">Across {globalData?.markets?.toLocaleString()} exchanges</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Highlights Grid - Now Full Width Below Metrics */}
                {showHighlights && (
                    <HighlightsGrid trending={trending} gainers={gainers} />
                )}

                {/* Main Content Area */}
                <div className="space-y-4">
                    {/* Filters - Simplified */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <Button variant="secondary" size="sm" className="bg-white dark:bg-card border border-border/50 text-foreground font-bold px-4 h-9 shadow-sm hover:bg-gray-50">All Assets</Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-bold px-4 h-9 whitespace-nowrap">Gainers & Losers</Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-bold px-4 h-9 whitespace-nowrap">New Listings</Button>
                        <div className="ml-auto">
                            <Button variant="outline" size="sm" className="h-9 bg-white dark:bg-card border-border/50 font-bold gap-2 shadow-sm text-xs">
                                <Zap className="h-3.5 w-3.5" />
                                Customize
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border/40 bg-card shadow-sm overflow-hidden">
                        <CoinTable coins={coins} loading={loading} />
                    </div>
                </div>
            </div>
        </div>
    );
}

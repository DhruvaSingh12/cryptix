"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import coinGeckoAPI from "@/lib/api/coingecko";
import { CoinDetail, MarketChart } from "@/lib/api/types";
import Link from "next/link";
import { CoinDetailHeader } from "./components/CoinDetailHeader";
import { CoinStatsCards } from "./components/CoinStatsCards";
import { PriceChart } from "./components/PriceChart";
import { CoinInfoTabs } from "./components/CoinInfoTabs";

export default function CoinDetailPage() {
    const params = useParams();
    const coinId = params.id as string;

    const [coin, setCoin] = useState<CoinDetail | null>(null);
    const [chartData, setChartData] = useState<MarketChart | null>(null);
    const [loading, setLoading] = useState(true);
    const [chartDays, setChartDays] = useState<string>("7");

    useEffect(() => {
        if (coinId) {
            fetchCoinData();
        }
    }, [coinId]);

    useEffect(() => {
        if (coinId) {
            fetchChartData();
        }
    }, [coinId, chartDays]);

    const fetchCoinData = async () => {
        try {
            const data = await coinGeckoAPI.getCoinById(coinId, {
                localization: false,
                tickers: false,
                marketData: true,
                communityData: true,
                developerData: true,
                sparkline: false,
            });
            setCoin(data);
        } catch (error) {
            console.error("Error fetching coin:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchChartData = async () => {
        try {
            const data = await coinGeckoAPI.getCoinMarketChart(coinId, "usd", chartDays);
            setChartData(data);
        } catch (error) {
            console.error("Error fetching chart:", error);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: price < 1 ? 6 : 2,
        }).format(price);
    };

    const formatLargeNumber = (value: number) => {
        if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
        return formatPrice(value);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-12 w-64" />
                <div className="grid gap-4 md:grid-cols-3">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
                <Skeleton className="h-96" />
            </div>
        );
    }

    if (!coin) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold">Coin not found</h2>
                <Link href="/dashboard/explore">
                    <Button className="mt-4">Back to Explore</Button>
                </Link>
            </div>
        );
    }

    const priceChange24h = coin.market_data?.price_change_percentage_24h || 0;
    const isPositive = priceChange24h >= 0;

    return (
        <div className="space-y-6">
            <CoinDetailHeader coin={coin} formatPrice={formatPrice} />

            <CoinStatsCards
                coin={coin}
                formatLargeNumber={formatLargeNumber}
                formatPrice={formatPrice}
            />

            <PriceChart
                chartData={chartData}
                chartDays={chartDays}
                onChartDaysChange={setChartDays}
                isPositive={isPositive}
                formatPrice={formatPrice}
            />

            <CoinInfoTabs coin={coin} formatPrice={formatPrice} />
        </div>
    );
}

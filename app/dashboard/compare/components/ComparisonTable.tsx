"use client";

import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown } from "lucide-react";
import { CoinDetail } from "@/lib/api/types";
import Image from "next/image";

interface ComparisonTableProps {
    coins: CoinDetail[];
}

export function ComparisonTable({ coins }: ComparisonTableProps) {
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

    const metrics = [
        { key: "price", label: "Current Price", getValue: (c: CoinDetail) => formatPrice(c.market_data?.current_price?.usd || 0) },
        { key: "change_24h", label: "24h Change", getValue: (c: CoinDetail) => c.market_data?.price_change_percentage_24h?.toFixed(2) + "%", isChange: true },
        { key: "change_7d", label: "7d Change", getValue: (c: CoinDetail) => c.market_data?.price_change_percentage_7d?.toFixed(2) + "%", isChange: true },
        { key: "change_30d", label: "30d Change", getValue: (c: CoinDetail) => c.market_data?.price_change_percentage_30d?.toFixed(2) + "%", isChange: true },
        { key: "market_cap", label: "Market Cap", getValue: (c: CoinDetail) => formatLargeNumber(c.market_data?.market_cap?.usd || 0) },
        { key: "volume", label: "24h Volume", getValue: (c: CoinDetail) => formatLargeNumber(c.market_data?.total_volume?.usd || 0) },
        { key: "rank", label: "Market Cap Rank", getValue: (c: CoinDetail) => `#${c.market_cap_rank || "N/A"}` },
        { key: "supply", label: "Circulating Supply", getValue: (c: CoinDetail) => c.market_data?.circulating_supply?.toLocaleString() || "N/A" },
        { key: "max_supply", label: "Max Supply", getValue: (c: CoinDetail) => c.market_data?.max_supply?.toLocaleString() || "∞" },
        { key: "ath", label: "All-Time High", getValue: (c: CoinDetail) => formatPrice(c.market_data?.ath?.usd || 0) },
        { key: "ath_change", label: "From ATH", getValue: (c: CoinDetail) => c.market_data?.ath_change_percentage?.usd?.toFixed(1) + "%", isChange: true },
        { key: "atl", label: "All-Time Low", getValue: (c: CoinDetail) => formatPrice(c.market_data?.atl?.usd || 0) },
    ];

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-48">Metric</TableHead>
                        {coins.map((coin) => (
                            <TableHead key={coin.id} className="text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <Image
                                        src={coin.image?.small || ""}
                                        alt={coin.name}
                                        width={20}
                                        height={20}
                                        className="rounded-full"
                                    />
                                    <span className="uppercase text-xs">{coin.symbol}</span>
                                </div>
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {metrics.map((metric) => (
                        <TableRow key={metric.key}>
                            <TableCell className="font-medium text-muted-foreground">
                                {metric.label}
                            </TableCell>
                            {coins.map((coin) => {
                                const value = metric.getValue(coin);
                                const numValue = parseFloat(value?.replace(/[^\-\d.]/g, '') || '0');

                                return (
                                    <TableCell key={coin.id} className="text-center font-mono">
                                        {metric.isChange ? (
                                            <span
                                                className={`flex items-center justify-center gap-1 ${numValue >= 0 ? "text-green-500" : "text-red-500"
                                                    }`}
                                            >
                                                {numValue >= 0 ? (
                                                    <TrendingUp className="h-3 w-3" />
                                                ) : (
                                                    <TrendingDown className="h-3 w-3" />
                                                )}
                                                {value}
                                            </span>
                                        ) : (
                                            value
                                        )}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}

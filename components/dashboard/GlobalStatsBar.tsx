"use client";

import { Activity, Zap, TrendingUp, BarChart3, Binary, Gauge } from "lucide-react";

interface GlobalStatsBarProps {
    data: any;
}

export function GlobalStatsBar({ data }: GlobalStatsBarProps) {
    if (!data) return null;

    const formatCurrency = (value: number) => {
        if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        return `$${(value / 1e6).toFixed(2)}M`;
    };

    const stats = [
        { label: "Coins", value: data.active_cryptocurrencies.toLocaleString(), icon: Binary },
        { label: "Exchanges", value: data.markets.toLocaleString(), icon: BarChart3 },
        {
            label: "Market Cap",
            value: formatCurrency(data.total_market_cap.usd),
            change: data.market_cap_change_percentage_24h_usd,
            icon: Activity
        },
        { label: "24h Vol", value: formatCurrency(data.total_volume.usd), icon: Zap },
        { label: "Dominance", value: `BTC ${data.market_cap_percentage.btc.toFixed(1)}% ETH ${data.market_cap_percentage.eth.toFixed(1)}%`, icon: TrendingUp },
    ];

    return (
        <div className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 py-2.5 overflow-x-auto sticky top-0 z-50">
            <div className="container mx-auto px-4 flex items-center justify-between gap-6 whitespace-nowrap text-[11px] font-medium text-muted-foreground">
                <div className="flex items-center gap-6">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-default">
                            <stat.icon className="h-3 w-3" />
                            <span>{stat.label}:</span>
                            <span className="text-primary font-bold">{stat.value}</span>
                            {"change" in stat && (
                                <span className={stat.change >= 0 ? "text-emerald-500" : "text-red-500"}>
                                    {stat.change >= 0 ? "▲" : "▼"} {Math.abs(stat.change).toFixed(1)}%
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
